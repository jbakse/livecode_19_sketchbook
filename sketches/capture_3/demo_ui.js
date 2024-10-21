// module
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

import "./grabber_ui.js";

window.setup = () => {
  pixelDensity(1);
  createCanvas(1280, 720);
  frameRate(60);

  setTimeout(() => {
    noLoop();
  }, 5000);
};

window.draw = () => {
  background(0);
  fill("white");
  noStroke();
  ellipse(width / 2 + random(-10, 10), height / 2 + random(-10, 10), 300, 300);
};
