// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* global  */
/* exported setup draw  mousePressed*/

let x = 0;
let y = 0;
let goalX = 256;
let goalY = 256;

function setup() {
  createCanvas(512, 512);
}

function draw() {
  background("black");

  if (x < goalX) x += 2;
  if (x > goalX) x -= 2;
  if (y < goalY) y += 2;
  if (y > goalY) y -= 2;

  noStroke();
  fill("white");
  ellipseMode(CORNER);

  const xI = roundTo(x, 32);
  const yI = roundTo(y, 32);
  const xF = smootherstep(-16, 16, x - xI) * 32;
  const yF = smootherstep(-16, 16, y - yI) * 32;

  ellipse(xI + xF, yI + yF, 32, 32);

  noFill("red");
  stroke("red");
  strokeWeight(4);
  line(goalX, goalY, goalX + 32, goalY + 32);
  line(goalX + 32, goalY, goalX, goalY + 32);
}

function mousePressed() {
  goalX = roundTo(mouseX, 32);
  goalY = roundTo(mouseY, 32);
}

function roundTo(value, x) {
  return Math.round(value / x) * x;
}

function smootherstep(edge0, edge1, x) {
  // Scale, and clamp x to 0..1 range
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * x * (x * (x * 6 - 15) + 10);
}
