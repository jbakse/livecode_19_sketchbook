// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

console.log("hello?");

const balls = [];

class Ball {
  constructor() {}
  step() {
    this.x = this.x + this.dX;
    this.y = this.y + this.dY;

    if (this.x > width) this.dX = -abs(this.dX);
    if (this.y > height) this.dY = -abs(this.dY);
    if (this.x < 0) this.dX = abs(this.dX);
    if (this.y < 0) this.dY = abs(this.dY);
  }
  draw() {
    ellipse(this.x, this.y, 20, 20);
  }
}

function setup() {
  createCanvas(600, 600);
  background(50, 50, 50);

  for (let i = 0; i < 20; i++) {
    let b = new Ball();
    b.x = 250;
    b.y = 100;
    b.dX = random(-5, 5);
    b.dY = random(-5, 5);
    balls.push(b);
  }
}

function draw() {
  stepScene();
  drawScene();
}

function stepScene() {
  for (const ball of balls) {
    ball.step();
  }
}

function drawScene() {
  background(50, 50, 50);
  fill(255, 0, 0);
  noStroke();

  for (const ball of balls) {
    ball.draw();
  }
}
