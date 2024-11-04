// module
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

import "./grabber_ui.js";

window.setup = () => {
  pixelDensity(2);
  createCanvas(1920, 1080);
  frameRate(30);
};

window.draw = () => {
  background(0);
  fill("white");
  noStroke();
  ellipse(width / 2 + random(-10, 10), height / 2 + random(-10, 10), 300, 300);

  noFill();
  stroke("white");
  strokeWeight(10);
  ellipse(width / 2 + random(-10, 10), height / 2 + random(-10, 10), 600, 600);
  ellipse(
    width / 2 + random(-10, 10),
    height / 2 + random(-10, 10),
    1200,
    1200
  );
};
