// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
/* exported setup draw */

function setup() {
  console.log("P5.VERSION:", p5.VERSION);

  // make a small canvas
  // use WEBGL + noSmooth() to get non antialiased shapes and lines
  pixelDensity(1);
  noSmooth();
  const mainCanvas = createCanvas(192, 108, WEBGL);

  // scale the canvas up, without antialiasing
  mainCanvas.elt.style =
    "width: 960px; height: 540px; image-rendering: pixelated";

  // configure P5
  ellipseMode(CENTER);
  fill("white");
  noStroke();
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(50);

  // disable depth testing
  drawingContext.disable(drawingContext.DEPTH_TEST);

  translate(width * -0.5, height * -0.5);
  for (let y = 0; y < height; y += 24) {
    for (let x = 0; x < width; x += 24) {
      push();
      translate(x + 16 + random(-10, 10), y + random(-10, 10));
      rotate(random(-10, 10));
      drawDocument(20, 24);
      pop();
    }
  }
}

function drawDocument(w, h) {
  push();

  rectMode(CENTER);

  fill(0, 50);
  rect(1, 1, w, h);

  fill("white");
  rect(0, 0, w, h);

  drawText(w, h);

  pop();
}

function drawText(w, h) {
  push();

  stroke("black");

  translate(w * -0.5, h * -0.5);
  for (let y = 3; y <= h - 3; y += 3) {
    line(3, y, w - random(0, w * 0.5), y);
  }

  pop();
}
