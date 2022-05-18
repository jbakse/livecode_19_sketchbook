// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
/* exported setup draw */

let face;

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

  // set up the p5.Graphics we'll use for drawing the faces
  face = createGraphics(16, 20, WEBGL);
  face.pixelDensity(1);
  face.noSmooth();
  face.noFill();
  face.noStroke();
  face.angleMode(DEGREES);
  face.drawingContext.disable(face.drawingContext.DEPTH_TEST);

  // disable bilinear filtering on the face p5.Graphics (make it jaggy!)
  p5.instance._curElement.getTexture(face).setInterpolation(NEAREST, NEAREST);
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

  if (random() < 0.5) {
    drawText(w, h);
  } else {
    drawFace();
  }

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

function drawFace() {
  // draw the face
  face.push();
  face.background(random([25, 125]));

  // offset heads in photo
  face.translate(random(-3, 3), random(-4, 4));

  // shirt
  face.fill(random([0, 100]));
  face.ellipse(0, 10, 20, 20);

  // hair
  if (random() < 0.9) {
    face.fill(random([50, 150, 250]));
    face.ellipse(0, -3, 13, 13);
  }
  // face
  face.fill(random([100, 150, 200, 250]));
  face.ellipse(0, 0, 10, 13);

  // eyes
  face.fill(255);
  face.ellipse(-2, 0, 2, 2);
  face.ellipse(2, 0, 2, 2);

  face.pop();

  // copy the `face` onto the main canvas
  push();
  imageMode(CENTER);
  image(face, 0, 0);
  pop();
}
