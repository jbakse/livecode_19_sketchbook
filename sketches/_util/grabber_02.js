// see: https://github.com/thenickdude/webm-writer-js
// if you require this, you also need to require
// - /sketches/libraries/webm-writer-0.3.0.js
// - https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js

/* globals Tweakpane WebMWriter */

// TODOS
// put in checks
// is this p5?
// am i in chrome? or better do i have webP/webM?
// - maybe support specific export resolution
//  - custom downsampling? https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads
// https://developer.mozilla.org/en-US/docs/Web/API/Worker

let _globalPane;

function globalPane() {
  if (!_globalPane) {
    _globalPane = new Tweakpane();
  }
  return _globalPane;
}

class RingBuffer {
  constructor(length) {
    this.buffer = [];
    this.length = length;
    this.bufferedLength = 0;
    this.index = 0;
  }
  push(v) {
    this.buffer[this.index] = v;
    this.index = (this.index + 1) % this.length;
    this.bufferedLength = min(this.length, this.buffer.length);
  }
  getArray() {
    if (this.buffer.length < this.length) {
      return this.buffer.slice(); // return copy
    } else {
      const end = this.buffer.slice(this.index);
      const start = this.buffer.slice(0, this.index - 1);
      return end.concat(start);
    }
  }
}

class Player {
  constructor(pane) {
    this.frames = "";
    this.fps = 0;
    this.spf = 0;
    this.lastTime = performance.now();

    this.setupPane(pane);
    this.bindP5();
  }

  setupPane(pane) {
    this.pane = pane || globalPane();
    this.folder = this.pane.addFolder({ title: "Player" });

    this.folder.addMonitor(this, "frames");
    this.folder.addMonitor(this, "fps");
    this.folder.addMonitor(this, "spf");

    if (p5) {
      const pause_button = this.folder.addButton({ title: "Pause" });
      const resume_button = this.folder.addButton({ title: "Resume" });
      pause_button.on("click", () => {
        noLoop();
        pause_button.hidden = true;
        resume_button.hidden = false;
      });
      resume_button.on("click", () => {
        loop();
        pause_button.hidden = false;
        resume_button.hidden = true;
      });
      resume_button.hidden = true;
    }
  }

  step() {
    this.frames++;
    const time = performance.now();
    const deltaTime = (time - this.lastTime) / 1000;
    this.spf = deltaTime;
    this.fps = 1 / deltaTime;
    this.lastTime = time;
  }

  bindP5() {
    if (p5) {
      p5.prototype.registerMethod("post", this.step.bind(this));
    }
  }
}

class Grabber {
  constructor(rbFrames = 30 * 10, pane) {
    this.exportSettings = {
      quality: 0.9,
      fps: 30,
      alpha: false,
    };
    this.info = {
      canvasSize: "unknown",
      fileSize: "unknown",
      buffered: "0/0",
    };
    this.ringBuffer = new RingBuffer(rbFrames);
    this.setupPane(pane);
    this.bindP5();
  }

  setupPane(pane) {
    this.pane = pane || globalPane();
    this.folder = this.pane.addFolder({ title: "Grabber" });

    this.folder.addMonitor(this.info, "canvasSize");
    this.folder.addInput(this.exportSettings, "quality", {
      min: 0,
      max: 0.99,
      label: "quality",
    });
    this.folder.addInput(this.exportSettings, "fps", {
      label: "fps",
      min: 1,
      max: 60,
      step: 1,
    });
    // this.folder.addInput(this.exportSettings, "alpha");

    this.folder.addMonitor(this.info, "buffered");

    const exportButton = this.folder.addButton({ title: "Export Recent" });
    exportButton.on("click", () => {
      this.export();
    });

    this.fileSizeMonitor = this.folder.addMonitor(this.info, "fileSize");
    this.downloadButton = this.folder.addButton({ title: "Download Export" });
    this.downloadButton.on("click", () => {
      this.download();
    });

    this.fileSizeMonitor.hidden = true;
    this.downloadButton.hidden = true;
  }

  bindP5() {
    if (p5) {
      p5.prototype.registerMethod("post", this.step.bind(this));
    }
  }

  step() {
    if (canvas) {
      // copy canvas and add to ringBuffer
      const backCanvas = document.createElement("canvas");
      backCanvas.width = canvas.width;
      backCanvas.height = canvas.height;
      const backCtx = backCanvas.getContext("2d");
      backCtx.drawImage(canvas, 0, 0);
      this.ringBuffer.push(backCanvas);

      //  update display info
      const MiBs = (canvas.width * canvas.height * 4) / (1024 * 1024);

      // prettier-ignore
      this.info.canvasSize = `${canvas.width} x ${canvas.height}, ${MiBs.toFixed(2)} MiB`;
      // prettier-ignore
      this.info.buffered = `${this.ringBuffer.bufferedLength} / ${this.ringBuffer.length} , ${(MiBs * this.ringBuffer.bufferedLength).toFixed(2)} MiB`;
    }
  }

  export() {
    const writer = new WebMWriter({
      quality: this.exportSettings.quality,
      frameRate: this.exportSettings.fps,
      transparent: this.exportSettings.alpha,
    });

    let a = this.ringBuffer.getArray();
    for (const canvas of a) {
      writer.addFrame(canvas);
    }

    writer.complete().then((blob) => {
      // show video
      const video = document.createElement("video");
      this.objectURL = URL.createObjectURL(blob);
      video.setAttribute("src", this.objectURL);
      video.setAttribute("controls", true);
      document.body.append(video);

      // update pane
      this.info.fileSize = `${(blob.size / (1024 * 1024)).toFixed(2)} MiB`;
      this.fileSizeMonitor.hidden = false;
      this.downloadButton.hidden = false;
    });
  }

  download() {
    if (!this.objectURL) return;

    // create download link and "click" it
    const a = document.createElement("a");
    a.download = "export.webm";
    a.href = this.objectURL;
    a.dataset.downloadurl = ["video/webm", a.download, a.href].join(":");
    a.click();

    // update pane
    this.fileSizeMonitor.hidden = true;
    this.downloadButton.hidden = true;
  }
}

// let player = new Player();
// let grabber = new Grabber();

new Player();
new Grabber();
