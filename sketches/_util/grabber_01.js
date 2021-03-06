// see: https://github.com/thenickdude/webm-writer-js
// if you require this, you also need to require
// /sketches/libraries/webm-writer-0.3.0.js

/* global WebMWriter */
/* exported Grabber */
/* global p5 */

class Grabber {
  constructor() {
    this.grabbing = false;
    this.framesGrabbed = 0;
    this.framesToGrab = 0;

    this.videoWriter = new WebMWriter({
      quality: 0.75, // WebM image quality from 0.0 (worst) to 0.99999 (best), 1.00 (VP8L lossless) is not supported
      fileWriter: null, // FileWriter in order to stream to a file instead of buffering to memory (optional)
      fd: null, // Node.js file handle to write to instead of buffering to memory (optional)

      // You must supply one of:
      frameDuration: null, // Duration of frames in milliseconds
      frameRate: 30, // Number of frames per second

      transparent: false, // True if an alpha channel should be included in the video
      alphaQuality: undefined, // Allows you to set the quality level of the alpha channel separately.
      // If not specified this defaults to the same value as `quality`.
    });

    if (p5) {
      p5.prototype.registerMethod("post", this.step.bind(this));
    }
  }

  grabFrames(c) {
    this.grabbing = true;
    this.framesToGrab = c;
  }

  grabFrame() {
    this.videoWriter.addFrame(canvas);
    console.log(
      `%cGrabber%c grabbed frame ${this.framesGrabbed + 1}/${
        this.framesToGrab
      }`,
      "background: black; color: white;",
      ""
    );
    this.framesGrabbed++;
  }

  step() {
    console.log("step", this.grabbing);
    if (this.grabbing) {
      this.grabFrame();
      if (this.framesGrabbed === this.framesToGrab) {
        this.complete();
      }
    }
  }

  complete() {
    this.grabbing = false;
    this.videoWriter.complete().then((blob) => {
      this.blob = blob;
      this.onComplete();
    });
  }

  onComplete() {
    this.download();
  }

  download() {
    if (!this.blob) return;
    const contentType = "video/webm";
    const a = document.createElement("a");
    a.download = "video.webm";
    a.href = window.URL.createObjectURL(this.blob);
    a.dataset.downloadurl = [contentType, a.download, a.href].join(":");
    a.click();
  }

  //   function showVideo(blob) {
  //     const v = document.createElement("video");
  //     v.setAttribute("src", URL.createObjectURL(blob));
  //     document.body.append(v);
  //   }
}
