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
    encoderCodec: "avc1.640033",
    // 0x64 = High Profile
    // 0x00 = no constraint flags
    // 0x33 = 51 = level 5.1 supports 4k@30
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
  #fps; // number the frame rate of the video output or "realtime"
  #settings; // object the settings for the video output
  #frameCount; // number the number of frames captured
  #startTime; // number time of construction
  #finished; // boolean whether the video has been finalized

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
    // throw if presetName not in presets
    if (!presets[presetName]) {
      throw new Error(`Unknown grabber preset: ${presetName}`);
    }
    this.#settings = presets[presetName];

    this.#fps = fps;

    this.#frameCount = 0;
    this.#startTime = performance.now();
    this.#finished = false;

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

        // Use in-memory fast start option
        // From Docs: This is the preferred option when using ArrayBufferTarget as it will result in a higher-quality output with no change in memory footprint.
        fastStart: "in-memory",
        firstTimestampBehavior: "offset",
      });
    } else {
      throw new Error("Unknown muxer");
    }

    this.#videoEncoder = new VideoEncoder({
      output: (chunk, meta) => this.#muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error(e),
    });

    let bitrate = 1e6;
    if (bitrateSetting === "auto") {
      // const rawBitrate = width * height * fps * 8 * 3; // 8 bits x 3 channels
      // examples of rawBitrates
      // 4k@30 = 5 971 968 000 or 5971 Mbits/s
      // 1080p@30 = 1 492 992 000 or 1492 Mbits/s

      // bitrate = rawBitrate / 10; // very high quality
      // bitrate = rawBitrate / 20; // high quality
      // bitrate = rawBitrate / 50; // low quality

      bitrate = 40e6;
      console.log(`auto bitrate: ${bitrate / 1e3} kbps`);
    }
    // if bitrateSetting is a number, use it
    if (typeof bitrateSetting === "number") {
      bitrate = bitrateSetting;
    }
    this.#videoEncoder.configure({
      codec: this.#settings.encoderCodec,
      width: width,
      height: height,
      bitrate: bitrate,
      // alpha: "keep",
    });
  }

  grabFrame(source) {
    if (this.#finished) return;

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
    // mark as finished before async flush, so incoming frames are ignored
    this.#finished = true;
    await this.#videoEncoder.flush();
    this.#muxer.finalize();
  }

  async download(fileName = "capture") {
    if (!this.#finished) await this.finish();
    const blob = new Blob([this.#muxer.target.buffer]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${this.#settings.suffix}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
