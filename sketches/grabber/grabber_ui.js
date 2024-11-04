// module
import { Grabber } from "./grabber.js";
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js";

// should be constructed after p5.js is loaded, but before setup() is called
export class GrabberUI {
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

    /// register p5 "post" callback to update UI after draw()
    window.p5.prototype.registerMethod("post", () => {
      this.step();
    });

    /// create Pane
    this.pane = new Pane();

    /// player folder
    const playerControls = this.pane.addFolder({
      title: "Player",
    });

    /// fps/spf
    playerControls.addBinding(this, "fps", {
      label: "FPS",
      format: (v) => v.toFixed(0),
      readonly: true,
    });

    playerControls.addBinding(this, "spf", {
      label: "SPF",
      readonly: true,
    });

    /// pause button
    this.#pauseButton = playerControls
      .addButton({
        title: "Pause",
      })
      .on("click", () => {
        isLooping() ? noLoop() : loop();
        this.updatePauseButton();
      });

    /// Grab .png Button
    playerControls
      .addButton({
        title: "Grab .png",
      })
      .on("click", () => {
        this.downloadFrame();
      });

    /// grabber folder
    const grabberControls = this.pane.addFolder({
      title: "Grabber",
    });

    /// canvas size
    grabberControls.addBinding(this, "canvasSize", {
      label: "Size",
      readonly: true,
    });

    /// preset
    // "webm" "mp4" or "mp4_h265"
    this.preset = localStorage.getItem("preset") ?? this.preset;
    grabberControls
      .addBinding(this, "preset", {
        label: "Preset",
        options: {
          webm: "webm",
          mp4: "mp4",
          mp4_h265: "mp4_h265",
        },
      })
      .on("change", (event) => {
        localStorage.setItem("preset", event.value);
      });

    /// fileName
    // string
    this.fileName = localStorage.getItem("fileName") ?? this.fileName;
    grabberControls
      .addBinding(this, "fileName", {
        label: "Out Name",
      })
      .on("change", (event) => {
        localStorage.setItem("fileName", event.value);
      });

    /// frameRate
    // 15, 24, 30, 60, or 0 ("realtime")
    this.frameRate =
      parseFloat(localStorage.getItem("frameRate")) || this.frameRate;
    grabberControls
      .addBinding(this, "frameRate", {
        label: "Out FPS",
        options: {
          15: 15.0,
          24: 24.0,
          30: 30.0,
          60: 60.0,
          realtime: 0.0,
        },
      })
      .on("change", (event) => {
        localStorage.setItem("frameRate", event.value);
      });

    /// quality
    // 0-1
    this.quality = parseFloat(localStorage.getItem("quality")) || this.quality;

    grabberControls
      .addBinding(this, "quality", {
        label: "Quality",
        min: 0.01,
        max: 1,
        step: 0.01,
      })
      .on("change", (event) => {
        localStorage.setItem("quality", event.value.toFixed(2));
      });

    /// bitRate
    grabberControls.addBinding(this, "bitRateFormatted", {
      label: "Bitrate",
      readonly: true,
    });

    /// autoStart
    // boolean
    this.autoStart = localStorage.getItem("autoStart") === "true";
    grabberControls
      .addBinding(this, "autoStart", {
        label: "AutoStart",
      })
      .on("change", (event) => {
        localStorage.setItem("autoStart", event.value);
      });

    /// Start Button
    this.#startButton = grabberControls
      .addButton({
        title: "Record Video",
      })
      .on("click", this.startRecording.bind(this));

    /// Stop Button
    this.#stopButton = grabberControls
      .addButton({
        title: "⬇️ Finish Video",
      })
      .on("click", this.stopRecording.bind(this));
    this.#stopButton.hidden = true;

    this.#cancelButton = grabberControls
      .addButton({
        title: "❌ Cancel Video",
      })
      .on("click", this.cancelRecording.bind(this));
    this.#cancelButton.hidden = true;

    /// framesCaptured
    grabberControls.addBinding(this, "framesCaptured", {
      label: "Frames",
      readonly: true,
      format: (v) => v.toFixed(0),
    });

    grabberControls.addBinding(this, "queueSize", {
      label: "Queue",
      readonly: true,
      format: (v) => v.toFixed(0),
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

    // wrap up the old one
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
    /// update fps/spf
    const now = performance.now();
    this.spf = (now - this.#oldTime) / 1000;
    this.fps = 1 / this.spf;
    this.#oldTime = now;

    /// update other bindings
    this.canvasSize = `${window.canvas.width} x ${window.canvas.height}`;
    this.bitRate =
      window.canvas.width *
      window.canvas.height *
      3 *
      8 *
      this.frameRate *
      this.quality;
    this.bitRateFormatted = `${(this.bitRate / 1e6).toFixed(2)} Mbps`;
    this.updatePauseButton();
    if (this.#capturing) this.framesCaptured++;

    /// capture video
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
}

window.grabberUI = new GrabberUI();
