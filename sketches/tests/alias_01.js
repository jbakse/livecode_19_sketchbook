// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// The default renderer in p5.js is P2D, which uses the HTML5 canvas API. Specifically, it uses a CanvasRenderingContext2D, which alwyas draws lines and shapes with anti-aliasing. This can't be disabled. As such, it is not possible to draw lines and shapes in P2D without anti-aliasing using the built-in drawing functions like rect, line, and ellipse.

// p5.js does have a noSmooth() funciton, but it doesn't work (for the reason above). Even the example on the docs shows two smoothed circles!

// https://p5js.org/reference/#/p5/noSmooth

let testImage;
function preload() {
  testImage = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAEZJREFUGFd9jcsNACAIQ9tB2MeR3YdBMBBq8CIXPi2vBICIiOwkOedatllqWO6Y8yOWoyuNf1GZwgmf+RRG2YXr+xVFmA8HZ9Mx/KGPMtcAAAAASUVORK5CYII="
  );
}

function setup() {
  console.log("P5.VERSION:", p5.VERSION);

  // make a small canvas
  pixelDensity(1);
  const c = createCanvas(192, 108); // P2D renderer is the default

  // display the canvas scaled up, so we can clearly see the pixels
  c.style("width", "950px");
  c.style("height", "540px");
  c.style("image-rendering", "pixelated");
  noLoop();
  ellipseMode(CORNER);
}

function draw() {
  background(128);

  // smooth Tests
  smooth();
  drawTests();

  // noSmooth Tests
  noSmooth();
  translate(0, 48);
  drawTests();
}

function drawTests() {
  // ellipse
  push();
  noStroke();
  fill("white");
  ellipse(8, 8, 32, 32);
  pop();

  // rotated square
  push();
  noStroke();
  fill("white");
  translate(72, 24);
  rotate(0.1);
  translate(-16, -16);
  rect(0, 0, 32, 32);
  pop();

  // rotated square outline
  push();
  noFill();
  stroke("white");
  translate(120, 24);
  rotate(0.1);
  translate(-16, -16);
  rect(0, 0, 32, 32);
  pop();

  // not rotated square outline
  push();
  noFill();
  stroke("white");
  translate(120, 24);
  translate(-8, -8);
  rect(0, 0, 16, 16);
  translate(0.5, 0.5); // translate into the centers of the pixel grid (this cleans up 1 pixel lines)
  rect(4, 4, 8, 8);
  pop();

  // lines
  push();
  noFill();
  stroke("white");
  line(152, 8, 152 + 32, 8 + 32);
  strokeWeight(8);
  line(152, 8 + 32, 152 + 32, 8);
  pop();

  // image
  image(testImage, 0, 0);
  image(testImage, 8, 0, 16, 16);
}
