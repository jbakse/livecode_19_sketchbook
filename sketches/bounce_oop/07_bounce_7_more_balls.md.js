// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 7

// At this point the code is pretty clean. This version doesn't change anything other than adding more balls.

// Take a look at the complete program below. This program is written in a [procedural](https://en.wikipedia.org/wiki/Procedural_programming) style.
// In the procedural programming paradigm, procedures/functions are the primary way of breaking down and organizing code.

let balls = [];

function setup() {
  createCanvas(600, 600);
  frameRate(60);

  for (let i = 0; i < 50; i++) {
    balls[i] = {
      x: 300,
      y: 300,
      deltaX: random(-5, 5),
      deltaY: random(-5, 5),
      radius: random(5, 20),
    };
  }
}

function draw() {
  stepApp();
  drawApp();
}

function stepApp() {
  for (const ball of balls) {
    stepBall(ball);
  }
}

function stepBall(b) {
  b.x += b.deltaX;
  b.y += b.deltaY;

  if (b.x > width - b.radius) b.deltaX = -abs(b.deltaX);
  if (b.y > height - b.radius) b.deltaY = -abs(b.deltaY);
  if (b.x < 0 + b.radius) b.deltaX = abs(b.deltaX);
  if (b.y < 0 + b.radius) b.deltaY = abs(b.deltaY);
}

function drawApp() {
  background(10);
  for (const ball of balls) {
    drawBall(ball);
  }
}

function drawBall(b) {
  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(b.x, b.y, b.radius * 2, b.radius * 2);
  pop();
}
