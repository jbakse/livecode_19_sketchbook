// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 6

// This version continues to clean up the code by combining the `ball` and `ball2` into an array called `balls`.

// ## Describe State Data

// First we create the empty array.

let balls = [];

// Then we add data objects to it.
balls[0] = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10,
};

balls[1] = {
  x: 200,
  y: 10,
  deltaX: 7,
  deltaY: 6,
  radius: 20,
};

// ## setup()

function setup() {
  createCanvas(600, 600);
  frameRate(60);

  /*
  for (let i = 0; i < 50; i++) {
    balls[i] = {
      x: 100,
      y: 100,
      deltaX: random(-5, 5),
      deltaY: random(-5, 5),
      radius: random(5, 20),
    };
  }
  */
}

// ## draw()

function draw() {
  stepApp();
  drawApp();
}

// ## stepApp()

// Organizing the ball data as entries in an array explains the list relationship to Javascript.
// Now we can iterate over the items in the list—the balls—rather than calling stepBall explicitly for each ball.
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

// ## drawApp()

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
