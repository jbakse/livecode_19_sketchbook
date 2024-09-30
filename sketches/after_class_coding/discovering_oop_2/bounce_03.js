// bounce_03.js
// This is a simple implementation of a bouncing ball animation using object-oriented programming.

// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

class Ball {
  constructor(x, y, deltaX, deltaY) {
    // encapsulate state from arguments
    this.x = x;
    this.y = y;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
  }

  update() {
    // move self based on own velocity
    this.x += this.deltaX;
    this.y += this.deltaY;

    // bounce self off the edges of the screen.
    if (this.x > width) this.deltaX = -abs(this.deltaX);
    if (this.y > height) this.deltaY = -abs(this.deltaY);
    if (this.x < 0) this.deltaX = abs(this.deltaX);
    if (this.y < 0) this.deltaY = abs(this.deltaY);
  }

  render() {
    // draw the ball
    ellipse(this.x, this.y, 20, 20);
  }
}

// declare and initialize our program state variables.
const balls = [
  //
  new Ball(100, 10, 5, 7),
  new Ball(200, 10, 4, 9),
];

// set up p5 canvas and drawing properties.
function setup() {
  createCanvas(600, 600);
  noStroke();
  fill("white");
}

function draw() {
  update();
  render();
}

function update() {
  // tell the balls to update themselves
  for (const ball of balls) {
    ball.update();
  }
}

function render() {
  // clear the drawing
  background("gray");

  // tell the balls to draw themselves
  for (const ball of balls) {
    ball.render();
  }
}
