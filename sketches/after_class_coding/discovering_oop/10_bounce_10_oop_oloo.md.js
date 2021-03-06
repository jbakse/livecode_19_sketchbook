// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 10

// This version doesn't change the program behavior.
// Like version 8, this version is written using an object-oriented approach.

// This version uses the Objects Linking to Other Objects—OLOO—approach to oop.
// see: [You Don't Know Javascript: prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch6.md)

const Ball = {
  init() {
    this.x = 300;
    this.y = 300;
    this.deltaX = random(-5, 5);
    this.deltaY = random(-5, 5);
    this.radius = random(5, 20);
    return this;
  },

  step() {
    this.x += this.deltaX;
    this.y += this.deltaY;

    if (this.x > width - this.radius) this.deltaX = -abs(this.deltaX);
    if (this.y > height - this.radius) this.deltaY = -abs(this.deltaY);
    if (this.x < 0 + this.radius) this.deltaX = abs(this.deltaX);
    if (this.y < 0 + this.radius) this.deltaY = abs(this.deltaY);
  },

  draw() {
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    pop();
  },
};

let balls = [];

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  for (let i = 0; i < 50; i++) {
    const b = Object.create(Ball).init();
    balls.push(b);
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
