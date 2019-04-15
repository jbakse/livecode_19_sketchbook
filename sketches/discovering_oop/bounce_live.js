// # Version 2

// This is a very simple implementation of a bouncing ball animation. Each frame it moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version creates collects the physics and collision into a code to reduce code repetition.
// Reducing repetion in code is usually a good thing. It makes the code shorter, easier to read, and easier to maintain.

// ## Describe State Data

let balls = [];

// ## Setup

window.setup = function() {
  createCanvas(600, 600);
  colorMode(HSB, 1);
  frameRate(60);

  for (let i = 0; i < 50; i++) {
    balls[i] = {
      x: 100,
      y: 100,
      deltaX: random(-5, 5),
      deltaY: random(-5, 5),
      radius: random(5, 20),
      step: stepBall,
      draw: drawBall
    };
  }

  balls[3].step = stepBallGravity;
  balls[4].draw = drawSpecialBall;
};

// ## Draw

window.draw = function() {
  stepApp();
  drawApp();
};

// ## StepApp

function stepApp() {
  for (const ball of balls) {
    ball.step();
  }
}

function stepBall() {
  // forces + physics
  this.x += this.deltaX;
  this.y += this.deltaY;

  // collisions
  if (this.x + this.radius > width) this.deltaX = -abs(this.deltaX);
  if (this.y > height - this.radius) this.deltaY = -abs(this.deltaY);
  if (this.x < 0 + this.radius) this.deltaX = abs(this.deltaX);
  if (this.y < 0 + this.radius) this.deltaY = abs(this.deltaY);
}

function stepBallGravity() {
  // forces + physics
  this.x += this.deltaX;
  this.y += this.deltaY;

  this.deltaY += 2;

  // collisions
  if (this.x + this.radius > width) this.deltaX = -abs(this.deltaX);
  if (this.y > height - this.radius) this.deltaY = -abs(this.deltaY);
  if (this.x < 0 + this.radius) this.deltaX = abs(this.deltaX);
  if (this.y < 0 + this.radius) this.deltaY = abs(this.deltaY);
}

// ## DrawApp

function drawApp() {
  background(0, 0, 0.2);
  for (const ball of balls) {
    // drawBall(ball);
    ball.draw();
  }
}

// `drawBall()` uses `push()` and `pop()` to isolate any p5 state changes
// Without `push()` and `pop()`, this function would have two side effects
// —changing the fill color and disabling stroke—that would spill into future
// drawing elsewhere in the code

function drawBall() {
  push();
  noStroke();
  fill(0, 1, 1);
  ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  pop();
}

function drawSpecialBall() {
  push();
  noStroke();
  fill(0.5, 1, 1);
  ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  pop();
}
