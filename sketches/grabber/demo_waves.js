// module

import { Grabber } from "./grabber.js";
import "https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js";

let grabber;

window.setup = function () {
  pixelDensity(1);
  createCanvas(1920, 1080);
  background(0);
  grabber = new Grabber(1920, 1080, 30);
};

window.draw = function () {
  push();
  background(0);
  fill("white");
  stroke(0);
  strokeWeight(2);
  for (let y = -100; y < height + 100; y += 10) {
    beginShape();
    vertex(-100, y + 100);
    for (let x = -100; x < width + 100; x += 10) {
      const n = noise(
        x * 0.002,
        y * 0.01 + frameCount * 0.01,
        frameCount * 0.01
      );
      vertex(x, y + n * 100);
    }
    vertex(width + 100, y + 100);
    endShape();
    if (y === 200) filter(BLUR, 3);
    if (y === 300) filter(BLUR, 2);
    if (y === 400) filter(BLUR, 2);
    if (y === 500) filter(BLUR, 1);
    if (y === 600) filter(BLUR, 1);
    if (y === 700) filter(BLUR, 1);
    if (y === 800) filter(BLUR, 1);
  }
  pop();

  console.log(frameCount, frameRate().toFixed(2));

  if (grabber) {
    grabber.grabFrame(canvas);
    if (frameCount === 300) {
      console.log("downloading");
      grabber.download(`wave_test`);
      noLoop();
    }
  }
};

window.mousePressed = function () {
  noLoop();
};
