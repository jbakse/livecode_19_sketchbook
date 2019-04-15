// # Version 2

// This is a very simple implementation of a bouncing ball animation. Each frame it moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version creates collects the physics and collision into a code to reduce code repetition.
// Reducing repetion in code is usually a good thing. It makes the code shorter, easier to read, and easier to maintain.

// ## Describe State Data

let balls = [];
balls[0] = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10
};

balls[1] = {
  x: 200,
  y: 10,
  deltaX: 7,
  deltaY: 6,
  radius: 20
};

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
      radius: random(5, 20)
    };
  }
};

// ## Draw

window.draw = function() {
  stepApp();
  drawApp();
};

// ## StepApp

function stepApp() {
  for (const ball of balls) {
    stepBall(ball);
  }
}

function stepBall(b) {
  // forces + physics
  b.x += b.deltaX;
  b.y += b.deltaY;

  // collisions
  if (b.x > width - b.radius) b.deltaX = -abs(b.deltaX);
  if (b.y > height - b.radius) b.deltaY = -abs(b.deltaY);
  if (b.x < 0 + b.radius) b.deltaX = abs(b.deltaX);
  if (b.y < 0 + b.radius) b.deltaY = abs(b.deltaY);
}

// ## DrawApp

function drawApp() {
  background(0, 0, 0.2);
  for (const ball of balls) {
    drawBall(ball);
  }
}

// `drawBall()` uses `push()` and `pop()` to isolate any p5 state changes
// Without `push()` and `pop()`, this function would have two side effects
// —changing the fill color and disabling stroke—that would spill into future
// drawing elsewhere in the code

function drawBall(b) {
  push();
  noStroke();
  fill(0, 1, 1);
  ellipse(b.x, b.y, b.radius * 2, b.radius * 2);
  pop();
}
