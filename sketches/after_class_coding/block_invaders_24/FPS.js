export class FPS {
  constructor() {
    this.frameCount = 0; // Total number of frames
    this.fps = 0; // Current frames per second
    this.lastTime = performance.now(); // The time of the last frame
    this.frames = []; // Frame times to calculate FPS over a short period
    this.fpsDisplay = null; // The div that shows the FPS
  }

  step() {
    this.frameCount++; // Increment the total frame count
    const now = performance.now(); // Current time in milliseconds

    // Calculate the time difference between the current and last frame
    const delta = now - this.lastTime;
    this.lastTime = now;

    // Calculate the current frame's FPS (inverse of the frame time in seconds)
    const fpsNow = 1000 / delta;
    this.frames.push(fpsNow); // Add current FPS to the list of recent frames

    // Only keep track of the last 60 frames (adjust for your needs)
    if (this.frames.length > 60) {
      this.frames.shift(); // Remove the oldest frame FPS data
    }

    // Calculate the average FPS over the recent frames
    this.fps = this.frames.reduce((a, b) => a + b) / this.frames.length;

    // Update the displayed FPS if show() was called
    if (this.fpsDisplay) {
      this.fpsDisplay.innerText = `FPS: ${this.fps.toFixed(2)}`;
    }
  }

  show() {
    // If the div doesn't exist, create it
    if (!this.fpsDisplay) {
      this.fpsDisplay = document.createElement("div");
      this.fpsDisplay.style.position = "fixed";
      this.fpsDisplay.style.top = "10px";
      this.fpsDisplay.style.right = "10px";
      this.fpsDisplay.style.backgroundColor = "#0008"; // Semi-transparent black
      this.fpsDisplay.style.color = "cyan"; // Cyan text
      this.fpsDisplay.style.padding = "5px 10px";
      this.fpsDisplay.style.fontFamily = "monospace";
      this.fpsDisplay.style.fontSize = "14px";
      this.fpsDisplay.style.borderRadius = "5px";
      this.fpsDisplay.style.zIndex = "1000";
      this.fpsDisplay.innerText = `FPS: ${this.fps.toFixed(2)}`;
      document.body.appendChild(this.fpsDisplay);
    }
  }

  hide() {
    // Remove the FPS div if it exists
    if (this.fpsDisplay) {
      document.body.removeChild(this.fpsDisplay);
      this.fpsDisplay = null;
    }
  }
}

// Example usage
//   let fps = new FPS();

//   function setup() {
//     fps.show(); // Show the FPS display
//   }

//   function draw() {
//     fps.step(); // Update the FPS and frame count
//   }
