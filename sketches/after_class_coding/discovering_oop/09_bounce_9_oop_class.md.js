// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// # Version 9

// This version doesn't change the program behavior. Like version 8, this version is written using an object-oriented approach.

// This version uses es6's `class` keyword.

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
