// module
import "https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js";
import "./grabber_ui.js";

window.setup = function () {
  pixelDensity(1);
  createCanvas(1920, 1080);
  background(0);
  frameRate(15);
};

window.draw = function () {
  push();
  noStroke();

  fill(0, 100);
  rect(0, 0, width / 2, height);

  fill(0);
  rect(width / 2, 0, width / 2, height);

  noFill();
  stroke(255);

  translate(width / 2, height / 2);
  rotate(frameCount / 30);
  for (let y = -10; y <= 10; y++) {
    for (let x = -10; x <= 10; x++) {
      rect(x * 100, y * 100, 80, 80);
    }
  }
  pop();
};
