import * as WebMMuxer from "https://cdn.jsdelivr.net/npm/webm-muxer@5.0.2/build/webm-muxer.mjs";

import * as Mp4Muxer from "https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/build/mp4-muxer.mjs";

/**
 * Reference Links:
 * https://github.com/Vanilagy/webm-muxer
 * https://github.com/Vanilagy/mp4-muxer
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs
 * https://caniuse.com/?search=video%20format
 * https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder
 * https://dmnsgn.github.io/media-codecs/
 *
 * Compatability tested at 4k/30.
 *                 Encode                      Playback
 *                 Chrome   Safari   Firefox   QTPlayer Chrome Safari VLC
 * webm/vp9        yes      yes      ?         no       yes    yes    yes
 * mp4/avc(h.264)  yes      no       ?         yes      ?      ?      ?
 * mp4/hvec(h.265) no       yes      ?         yes      ?      ?      ?
 *
 * no browser support alpha encoding
 */
const presets = {
  webm: {
    muxer: "webm",
    suffix: "webm",
    keyFrameRate: 30,
    muxerCodec: "V_VP9",
    encoderCodec: "vp09.00.50.08",
    // 00 = profile 00
    // 50 = level 5.0 4096×2176@30
    // 08 = color depth 8 bit
    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#vp9
  },
  mp4: {
    // not working in safari
    muxer: "mp4",
    suffix: "mp4",
    keyFrameRate: 30,
    muxerCodec: "avc",
    encoderCodec: "avc1.640034",
    // 0x64 = High Profile
    // 0x00 = no constraint flags
    // 0x34 = 52 = level 5.2 supports 4k@30
  },
  mp4_h265: {
    // not supported in chrome
    muxer: "mp4",
    suffix: "mp4",
    keyFrameRate: 30,
    muxerCodec: "hevc",
    encoderCodec: "hev1.2.6.L93.B0",
    // HEVC Main 10 Profile Compability 6 Level 3.1 Tier Main
    // chosen without much consideration
  },
};
export class Grabber {
  static async isPresetSupported(presetName) {
    if (!presets[presetName]) {
      throw new Error(`Unknown grabber preset: ${presetName}`);
    }

    const settings = presets[presetName];
    const support = await VideoEncoder.isConfigSupported({
      codec: settings.encoderCodec,
      width: 1920 * 2,
      height: 1080 * 2,
      bitrate: 40e6,
    });

    return support.supported;
  }

  // settings
  #fps; // number the frame rate of the video output or "realtime"
  #settings; // object the settings for the video output

  // state
  #frameCount = 0; // number the number of frames captured
  #startTime = performance.now(); // number time of construction
  #finished = false; // boolean whether the capture has been finalized
  #canceled = false; // boolean whether the capture has been canceled

  // components
  #muxer; // WebMMuxer.Muxer | Mp4Muxer.Muxer
  #videoEncoder; // VideoEncoder

  /**
   * Creates an instance of the class.
   *
   * @constructor
   * @param {number} width - width of the video output
   * @param {number} height - height of the video output
   * @param {number} fps - fps of the video output or "realtime"
   * @param {number} [keyFrameRate=30] - frequency of keyframes
   */

  constructor(
    width,
    height,
    fps = 30,
    presetName = "webm",
    bitrateSetting = "auto"
  ) {
    this.#fps = fps;
    if (!presets[presetName]) {
      throw new Error(`Unknown grabber preset: ${presetName}`);
    }
    this.#settings = presets[presetName];

    if (this.#settings.muxer === "webm") {
      this.#muxer = new WebMMuxer.Muxer({
        target: new WebMMuxer.ArrayBufferTarget(),
        video: {
          codec: this.#settings.muxerCodec,
          width: width,
          height: height,
        },

        firstTimestampBehavior: "offset",
      });
    } else if (this.#settings.muxer === "mp4") {
      this.#muxer = new Mp4Muxer.Muxer({
        target: new Mp4Muxer.ArrayBufferTarget(),
        video: {
          codec: this.#settings.muxerCodec,
          width: width,
          height: height,
        },

        /**
        Use in-memory fast start option
        From Docs: This is the preferred option when using ArrayBufferTarget as it will result in a higher-quality output with no change in memory footprint.
        */
        fastStart: "in-memory",
        firstTimestampBehavior: "offset",
      });
    } else {
      throw new Error("Unknown muxer");
    }

    this.#videoEncoder = new VideoEncoder({
      output: (chunk, meta) => {
        this.#muxer.addVideoChunk(chunk, meta);
      },
      error: (e) => {
        this.#canceled = true;
        console.error(e);
      },
    });

    this.#videoEncoder.configure({
      codec: this.#settings.encoderCodec,
      width: width,
      height: height,
      bitrate: typeof bitrateSetting === "number" ? bitrateSetting : 1e6,
      // alpha: "keep", // keep not supported in any browser yet
    });
  }

  grabFrame(source) {
    if (this.#finished) return;
    if (this.#canceled) return;

    const seconds =
      this.#fps === "realtime"
        ? (performance.now() - this.#startTime) / 1000 // realtime
        : this.#frameCount / this.#fps;

    const frame = new VideoFrame(source, {
      timestamp: seconds * 1000 * 1000,
    });

    const keyFrame = this.#frameCount % this.#settings.keyFrameRate === 0;

    this.#videoEncoder.encode(frame, { keyFrame });
    frame.close();

    this.#frameCount++;
  }

  async finish() {
    if (this.#finished) return;
    if (this.#canceled) return;
    // mark as finished before async flush, so incoming frames are ignored
    this.#finished = true;

    await this.#videoEncoder.flush();
    this.#muxer.finalize();
  }

  cancel() {
    if (this.#finished) return;
    if (this.#canceled) return;

    this.#canceled = true;
    this.#videoEncoder.reset();
    this.#videoEncoder.close();
  }

  async download(fileName = "capture") {
    if (this.#canceled) return;
    if (!this.#finished) await this.finish();

    const blob = new Blob([this.#muxer.target.buffer]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${this.#settings.suffix}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getEncodeQueueSize() {
    return this.#videoEncoder.encodeQueueSize;
  }
}
