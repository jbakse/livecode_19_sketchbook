// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

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
  noLoop();
}

function draw() {
  background("black");

  translate(width * -0.5, height * -0.5);

  ellipse(96, 54, 48, 48);
}
