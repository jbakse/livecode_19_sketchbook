// sketches/grabber/grabber.js
import * as WebMMuxer from "https://cdn.jsdelivr.net/npm/webm-muxer@5.0.2/build/webm-muxer.mjs";
import * as Mp4Muxer from "https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/build/mp4-muxer.mjs";
var presets = {
  webm: {
    muxer: "webm",
    suffix: "webm",
    keyFrameRate: 30,
    muxerCodec: "V_VP9",
    encoderCodec: "vp09.00.50.08"
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
    encoderCodec: "avc1.640034"
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
    encoderCodec: "hev1.2.6.L93.B0"
    // HEVC Main 10 Profile Compability 6 Level 3.1 Tier Main
    // chosen without much consideration
  }
};
var Grabber = class {
  static async isPresetSupported(presetName) {
    if (!presets[presetName]) {
      throw new Error(`Unknown grabber preset: ${presetName}`);
    }
    const settings = presets[presetName];
    const support = await VideoEncoder.isConfigSupported({
      codec: settings.encoderCodec,
      width: 1920 * 2,
      height: 1080 * 2,
      bitrate: 4e7
    });
    return support.supported;
  }
  // settings
  #fps;
  // number the frame rate of the video output or "realtime"
  #settings;
  // object the settings for the video output
  // state
  #frameCount = 0;
  // number the number of frames captured
  #startTime = performance.now();
  // number time of construction
  #finished = false;
  // boolean whether the capture has been finalized
  #canceled = false;
  // boolean whether the capture has been canceled
  // components
  #muxer;
  // WebMMuxer.Muxer | Mp4Muxer.Muxer
  #videoEncoder;
  // VideoEncoder
  /**
   * Creates an instance of the class.
   *
   * @constructor
   * @param {number} width - width of the video output
   * @param {number} height - height of the video output
   * @param {number} fps - fps of the video output or "realtime"
   * @param {number} [keyFrameRate=30] - frequency of keyframes
   */
  constructor(width, height, fps = 30, presetName = "webm", bitrateSetting = "auto") {
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
          width,
          height
        },
        firstTimestampBehavior: "offset"
      });
    } else if (this.#settings.muxer === "mp4") {
      this.#muxer = new Mp4Muxer.Muxer({
        target: new Mp4Muxer.ArrayBufferTarget(),
        video: {
          codec: this.#settings.muxerCodec,
          width,
          height
        },
        /**
        Use in-memory fast start option
        From Docs: This is the preferred option when using ArrayBufferTarget as it will result in a higher-quality output with no change in memory footprint.
        */
        fastStart: "in-memory",
        firstTimestampBehavior: "offset"
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
      }
    });
    this.#videoEncoder.configure({
      codec: this.#settings.encoderCodec,
      width,
      height,
      bitrate: typeof bitrateSetting === "number" ? bitrateSetting : 1e6
      // alpha: "keep", // keep not supported in any browser yet
    });
  }
  grabFrame(source) {
    if (this.#finished) return;
    if (this.#canceled) return;
    const seconds = this.#fps === "realtime" ? (performance.now() - this.#startTime) / 1e3 : this.#frameCount / this.#fps;
    const frame = new VideoFrame(source, {
      timestamp: seconds * 1e3 * 1e3
    });
    const keyFrame = this.#frameCount % this.#settings.keyFrameRate === 0;
    this.#videoEncoder.encode(frame, { keyFrame });
    frame.close();
    this.#frameCount++;
  }
  async finish() {
    if (this.#finished) return;
    if (this.#canceled) return;
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
};

// sketches/grabber/grabber_ui.js
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js";
var GrabberUI = class {
  // output bindings
  fps = 0;
  spf = 0;
  canvasSize = "0 x 0";
  canvasName = "canvas";
  framesCaptured = 0;
  queueSize = 0;
  bitRate = 0;
  bitRateFormatted = "0 Mbps";
  // input bindings
  preset = "webm";
  fileName = "untitled";
  quality = 1;
  frameRate = 30;
  autoStart = true;
  // pane references
  #pauseButton;
  #startButton;
  #stopButton;
  #cancelButton;
  // state
  #capturing = false;
  #oldTime = performance.now();
  // components
  #grabber;
  constructor() {
    if (!window.p5) throw new Error("GrabberUI requires p5.js");
    window.p5.prototype.registerMethod("post", () => {
      this.step();
    });
    this.pane = new Pane();
    const playerControls = this.pane.addFolder({
      title: "Player"
    });
    playerControls.addBinding(this, "fps", {
      label: "FPS",
      format: (v) => v.toFixed(0),
      readonly: true
    });
    playerControls.addBinding(this, "spf", {
      label: "SPF",
      readonly: true
    });
    this.#pauseButton = playerControls.addButton({
      title: "Pause"
    }).on("click", () => {
      isLooping() ? noLoop() : loop();
      this.updatePauseButton();
    });
    playerControls.addButton({
      title: "Grab .png"
    }).on("click", () => {
      this.downloadFrame();
    });
    const grabberControls = this.pane.addFolder({
      title: "Grabber"
    });
    grabberControls.addBinding(this, "canvasSize", {
      label: "Size",
      readonly: true
    });
    this.preset = localStorage.getItem("preset") ?? this.preset;
    grabberControls.addBinding(this, "preset", {
      label: "Preset",
      options: {
        webm: "webm",
        mp4: "mp4",
        mp4_h265: "mp4_h265"
      }
    }).on("change", (event) => {
      localStorage.setItem("preset", event.value);
    });
    this.fileName = localStorage.getItem("fileName") ?? this.fileName;
    grabberControls.addBinding(this, "fileName", {
      label: "Out Name"
    }).on("change", (event) => {
      localStorage.setItem("fileName", event.value);
    });
    this.frameRate = parseFloat(localStorage.getItem("frameRate")) || this.frameRate;
    grabberControls.addBinding(this, "frameRate", {
      label: "Out FPS",
      options: {
        15: 15,
        24: 24,
        30: 30,
        60: 60,
        realtime: 0
      }
    }).on("change", (event) => {
      localStorage.setItem("frameRate", event.value);
    });
    this.quality = parseFloat(localStorage.getItem("quality")) || this.quality;
    grabberControls.addBinding(this, "quality", {
      label: "Quality",
      min: 0.01,
      max: 1,
      step: 0.01
    }).on("change", (event) => {
      localStorage.setItem("quality", event.value.toFixed(2));
    });
    grabberControls.addBinding(this, "bitRateFormatted", {
      label: "Bitrate",
      readonly: true
    });
    this.autoStart = localStorage.getItem("autoStart") === "true";
    grabberControls.addBinding(this, "autoStart", {
      label: "AutoStart"
    }).on("change", (event) => {
      localStorage.setItem("autoStart", event.value);
    });
    this.#startButton = grabberControls.addButton({
      title: "Record Video"
    }).on("click", this.startRecording.bind(this));
    this.#stopButton = grabberControls.addButton({
      title: "\u2B07\uFE0F Finish Video"
    }).on("click", this.stopRecording.bind(this));
    this.#stopButton.hidden = true;
    this.#cancelButton = grabberControls.addButton({
      title: "\u274C Cancel Video"
    }).on("click", this.cancelRecording.bind(this));
    this.#cancelButton.hidden = true;
    grabberControls.addBinding(this, "framesCaptured", {
      label: "Frames",
      readonly: true,
      format: (v) => v.toFixed(0)
    });
    grabberControls.addBinding(this, "queueSize", {
      label: "Queue",
      readonly: true,
      format: (v) => v.toFixed(0)
    });
    setInterval(() => {
      this.queueSize = this.#grabber?.getEncodeQueueSize() || 0;
    }, 200);
  }
  updatePauseButton() {
    if (window.isLooping && isLooping()) {
      this.#pauseButton.title = "Pause";
    } else {
      this.#pauseButton.title = "Resume";
    }
  }
  startRecording() {
    console.log(
      "%c Grabber UI %c starting capture",
      "color: white; background: black",
      ""
    );
    if (this.#grabber) this.#grabber.cancel();
    this.#grabber = new Grabber(
      window.canvas.width,
      window.canvas.height,
      this.frameRate === 0 ? "realtime" : this.frameRate,
      this.preset,
      this.bitRate
    );
    this.#capturing = true;
    this.framesCaptured = 0;
    this.#startButton.hidden = true;
    this.#stopButton.hidden = false;
    this.#cancelButton.hidden = false;
  }
  async stopRecording() {
    console.log(
      "%c Grabber UI %c stopping capture",
      "color: white; background: black",
      ""
    );
    if (!this.#grabber) return;
    await this.#grabber.download(this.fileName);
    this.#capturing = false;
    this.#stopButton.hidden = true;
    this.#cancelButton.hidden = true;
    this.#startButton.hidden = false;
  }
  cancelRecording() {
    console.log(
      "%c Grabber UI %c canceling capture",
      "color: white; background: black",
      ""
    );
    if (!this.#grabber) return;
    this.#grabber.cancel();
    this.#capturing = false;
    this.#stopButton.hidden = true;
    this.#cancelButton.hidden = true;
    this.#startButton.hidden = false;
  }
  step() {
    const now = performance.now();
    this.spf = (now - this.#oldTime) / 1e3;
    this.fps = 1 / this.spf;
    this.#oldTime = now;
    this.canvasSize = `${window.canvas.width} x ${window.canvas.height}`;
    this.bitRate = window.canvas.width * window.canvas.height * 3 * 8 * this.frameRate * this.quality;
    this.bitRateFormatted = `${(this.bitRate / 1e6).toFixed(2)} Mbps`;
    this.updatePauseButton();
    if (this.#capturing) this.framesCaptured++;
    if (frameCount === 1 && this.autoStart) {
      this.startRecording();
    }
    if (this.#grabber) {
      this.#grabber.grabFrame(window.canvas);
    }
  }
  downloadFrame() {
    save(`${this.fileName}.png`);
  }
};
window.grabberUI = new GrabberUI();
export {
  GrabberUI
};
