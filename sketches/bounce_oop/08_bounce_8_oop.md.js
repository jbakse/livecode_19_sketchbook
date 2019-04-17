// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 8

// This version is written in an [Object-oriented](https://en.wikipedia.org/wiki/Object-oriented_programming) style.
// In the object-oriented programming (OOP), the code is broken down and organized using *objects*.

// In this program objects are used to represent the balls.

// Each object contains the data needed to represent the ball: `x`, `y`, `deltaX`, `deltaY`, `radius`.

// The ball objects **also** contain the functions—`step()` and `draw()`—that act on that data.

// Where version 7 used code like this `drawBall(ball)`, this OOP version uses `ball.draw()`. Instead of passing data to a function that draws that data, the ball object is asked to draw *itself*.

class Ball {
  constructor() {
    this.x = 300;
    this.y = 300;
    this.deltaX = random(-5, 5);
    this.deltaY = random(-5, 5);
    this.radius = random(5, 20);
  }

  step() {
    this.x += this.deltaX;
    this.y += this.deltaY;

    if (this.x > width - this.radius) this.deltaX = -abs(this.deltaX);
    if (this.y > height - this.radius) this.deltaY = -abs(this.deltaY);
    if (this.x < 0 + this.radius) this.deltaX = abs(this.deltaX);
    if (this.y < 0 + this.radius) this.deltaY = abs(this.deltaY);
  }

  draw() {
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    pop();
  }
}

let balls = [];

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  for (let i = 0; i < 50; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  stepApp();
  drawApp();
}

function stepApp() {
  for (const ball of balls) {
    ball.step();
  }
}

function drawApp() {
  background(10);
  for (const ball of balls) {
    ball.draw();
  }
}
