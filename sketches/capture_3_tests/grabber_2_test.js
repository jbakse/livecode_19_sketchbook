// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require /sketches/_libraries/webm-writer-0.3.0.js
// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require /sketches/_util/grabber_02.js

function setup() {
  pixelDensity(1);
  createCanvas(1280, 720);
  frameRate(10);
  console.log(grabber);
}

function draw() {
  background("gray");
  noStroke();
  fill("black");
  ellipse(map(frameCount, 1, 91, 0, width), height / 2, 200, 200);
  if (frameCount === 91) {
    noLoop();
    grabber.export();
  }
}
