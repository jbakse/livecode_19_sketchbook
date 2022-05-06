// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// draws an anti-aliased and an aliased spinning cube side by side

let c1;
let c2;

function setup() {
  console.log("P5.VERSION:", p5.VERSION);

  pixelDensity(1);
  c1 = createCanvas(192 * 0.5, 108, WEBGL);

  c2 = createGraphics(192 * 0.5, 108, WEBGL);
  c2.pixelDensity(1);
  c2.noSmooth();

  c1.elt.style =
    "width: 480px; height: 540px; image-rendering: pixelated; float: left";
  c2.elt.style = "width: 480px; height: 540px; image-rendering: pixelated";
}

function draw() {
  background("black");

  push();
  noFill();
  stroke("white");
  strokeWeight(1);
  translate(0, -5, 0);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005);
  box(30);
  pop();

  c2.clear();
  c2.background("black");
  c2.push();
  c2.noFill();
  c2.stroke("white");
  c2.strokeWeight(1);
  c2.translate(0, -5, 0);
  c2.rotateX(frameCount * 0.005);
  c2.rotateY(frameCount * 0.005);
  c2.box(30);
  c2.pop();
}
