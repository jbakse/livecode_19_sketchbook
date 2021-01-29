// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

console.log("hello?");

const balls = [];

function setup() {
  createCanvas(600, 600);
  background(50, 50, 50);

  for (let i = 0; i < 20; i++) {
    balls.push({
      x: 250,
      y: 100,
      dX: random(-5, 5),
      dY: random(-5, 5),
    });
  }
}

function draw() {
  stepScene();
  drawScene();
}

function stepScene() {
  for (const ball of balls) {
    stepBall(ball);
  }
}

function stepBall(b) {
  b.x = b.x + b.dX;
  b.y = b.y + b.dY;

  if (b.x > width) b.dX = -abs(b.dX);
  if (b.y > height) b.dY = -abs(b.dY);
  if (b.x < 0) b.dX = abs(b.dX);
  if (b.y < 0) b.dY = abs(b.dY);
}

function drawScene() {
  background(50, 50, 50);
  fill(255, 0, 0);
  noStroke();

  for (const ball of balls) {
    drawBall(ball);
  }
}

function drawBall(b) {
  ellipse(b.x, b.y, 20, 20);
}
