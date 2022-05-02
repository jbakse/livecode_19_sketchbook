// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// this is a POC to see if you can draw to a p5.Graphics and then draw that
// into a WEBGL render without bilenear filtering (aliased)

function setup() {
  console.log("P5.VERSION:", p5.VERSION);

  // make a small canvas
  pixelDensity(1);
  const c = createCanvas(192, 108, WEBGL);
  noSmooth();
  const canvas = document.getElementById("defaultCanvas0");
  canvas.style = "width: 950px; height: 540px; image-rendering: pixelated";

  noLoop();
}

function draw() {
  // move 0, 0 to the upper left corner
  translate(-width / 2, -height / 2);

  background("black");

  noFill();
  stroke("white");
  line(0, 0, 10, 10);

  const g = createGraphics(10, 10, WEBGL);
  g.noSmooth();
  g.background("white");
  g.stroke("black");
  g.translate(-5, -5);
  g.line(0, 0, 10, 10);

  const testTexture = p5.instance._curElement.getTexture(g);
  testTexture.setInterpolation(NEAREST, NEAREST);

  g.line(10, 0, 0, 10);

  image(g, 20, 0);
  image(g, 40, 0, 20, 20);
  translate(80, 5);
  rotate(radians(10));
  translate(-5, -5);
  image(g, 0, 0);
}
