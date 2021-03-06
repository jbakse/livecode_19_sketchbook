// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

function setup() {
  createCanvas(600, 400);
  background(50, 50, 50);
}

function draw() {
  fill(255, 100, 0);
  ellipse(300 + random(-5, 5), 300, 100, 100);
}
