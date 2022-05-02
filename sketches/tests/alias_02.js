// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// p5.js can also use the WEBGL renderer. This renderer is intended mostly for making sketches that use 3D graphics. You _can_ get p5 to draw nice aliased, jaggy shapes and lines with the WEBGL renderer but its a little quirky.

// Quirks:
// smooth() and noSmooth() reset the whole canvas/context (a biggie)
//  you can't switch modes during drawing
//  you probably only want to switch modes once in startup
//  even then, the canvas returned from createCanvas becomes out
//  of date when you call noSmooth()
// even if noSmooth() is set, images are still drawn with bilinear filtering
//  you can work around this with `setInterpolation` but its a bit tricky
// rectangles often have one corner pixel missing
// you might need to disable depth testing for the WEBGL renderer

// https://p5js.org/reference/#/p5/noSmooth

// related issues
// https://github.com/processing/p5.js/issues/4879

let testImage;
let textTexture;
function preload() {
  testImage = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAEZJREFUGFd9jcsNACAIQ9tB2MeR3YdBMBBq8CIXPi2vBICIiOwkOedatllqWO6Y8yOWoyuNf1GZwgmf+RRG2YXr+xVFmA8HZ9Mx/KGPMtcAAAAASUVORK5CYII="
  );
}

function setup() {
  console.log("P5.VERSION:", p5.VERSION);

  // make a small canvas
  pixelDensity(1);
  const c = createCanvas(192, 108, WEBGL);

  // calling noSmooth() seems to reset/reuild a WEBGL canvas, so you can't switch back and forth freely. Better to set it here once.
  const before = document.getElementById("defaultCanvas0");
  noSmooth();
  const after = document.getElementById("defaultCanvas0");
  console.log("c", c);
  console.log("before", before);
  console.log("after", after);
  console.log("c.elt === before", c.elt === before);
  console.log("c.elt === after", c.elt === after);

  // console.log("p5 properties", { ...p5 });
  // console.log("p5.instance", p5.instance);

  // display the canvas scaled up, so we can clearly see the pixels
  // calling noSmooth reset the canvas and `c` no longer refrences the
  // canvas element on the page.
  // so we set the style directly on the element.
  after.style = "width: 950px; height: 540px; image-rendering: pixelated";

  noLoop();
  ellipseMode(CORNER);
}

function draw() {
  // move 0, 0 to the upper left corner
  translate(-width / 2, -height / 2);

  background("gray");

  ///drawingContext.disable(drawingContext.DEPTH_TEST);

  // we can't switch between smooth() and noSmooth() in a WEBGL sketch
  // so we just draw the tests once.
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

  image(testImage, 0, 48);
  image(testImage, 8, 48, 16, 16);
  // these next to lines turn of bilinear filtering for the testImage
  // this is a bit hacky:
  // i don't think `p5.instance` is documented
  // and `_curElement` is undocmented and marked _private_ by an underscore
  testTexture = p5.instance._curElement.getTexture(testImage);
  testTexture.setInterpolation(NEAREST, NEAREST);

  image(testImage, 0, 64);
  image(testImage, 8, 64, 16, 16);
}
