// module
import { Grabber } from "./grabber.js";
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js";

export class GrabberUI {
  fps = 123;
  spf = 321;
  canvasSize = "0 x 0";
  canvasName = "canvas";
  #oldTime = performance.now();
  #pauseButton;
  #canvas;
  #grabber;

  constructor(canvas) {
    if (!window.p5) throw new Error("GrabberUI requires p5.js");

    this.#canvas = canvas ?? window.canvas;

    this.pane = new Pane();

    /// player folder
    const playerControls = this.pane.addFolder({
      title: "Player",
    });

    /// info
    this.fps = 0;
    playerControls.addBinding(this, "fps", {
      format: (v) => v.toFixed(0),
      readonly: true,
    });

    this.spf = 0;
    playerControls.addBinding(this, "spf", {
      readonly: true,
    });

    /// pause button
    this.#pauseButton = playerControls.addButton({
      title: "Pause",
    });
    this.#pauseButton.on("click", () => {
      isLooping() ? noLoop() : loop();
      this.updatePauseButton();
    });

    /// grabber folder
    const grabberControls = this.pane.addFolder({
      title: "Player",
    });

    /// info
    console.log(this.#canvas);

    grabberControls.addBinding(this, "canvasSize", {
      label: "Size",
      readonly: true,
    });

    /// Grab .png button
    const downloadButton = grabberControls.addButton({
      title: "Grab .png",
    });
    downloadButton.on("click", () => {
      this.downloadFrame();
    });

    /// Record .webm button
    const recordButton = grabberControls.addButton({
      title: "Record .webm",
    });
  }

  updatePauseButton() {
    if (window.isLooping && isLooping()) {
      this.#pauseButton.title = "Pause";
    } else {
      this.#pauseButton.title = "Resume";
    }
  }

  step() {
    console.log("step");
    const now = performance.now();
    this.spf = (now - this.#oldTime) / 1000;
    this.fps = 1 / this.spf;
    this.#oldTime = now;
    this.canvasSize = `${this.#canvas.width} x ${this.#canvas.height}`;
    this.updatePauseButton();
  }

  downloadFrame() {
    save("p5.png");
  }
}

let grabberUI;
if (window.p5) {
  window.p5.prototype.registerMethod("post", () => {
    if (!grabberUI) {
      grabberUI = new GrabberUI();
    }
    grabberUI.step();
  });
}
