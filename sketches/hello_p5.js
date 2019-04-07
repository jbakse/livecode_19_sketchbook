//require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

console.log("hello p5");

function setup() {
  console.log("i'm setup!");
  createCanvas(600, 400);
  background(50, 50, 50);
}

function draw() {
  fill(255, 0, 0);
  ellipse(300, 300, 100, 100);
}
