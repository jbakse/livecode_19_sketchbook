// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// # Version 4

// The previous version cleaned up the code; now it is time to start adding features. This version adds a second bouncing ball.

// ## Describe State Data

// First, create the data for a ball like before.

let ball = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10,
};

// Then, create the data for another ball.

let ball2 = {
  x: 200,
  y: 10,
  deltaX: 7,
  deltaY: 6,
  radius: 20,
};

// Adding the second ball requires five more values, but these are organized as fields of a single data object: `ball2`.
// Using data objects helps make it clear that we have two sets of related data rather than 10 unrelated values.

// > Variables with names like `ball`, `ball2`, and `ball3` are a [code smell](https://en.wikipedia.org/wiki/Code_smell) that suggests an array should be used. This will be done in a later version.
// But for this version, let's see what happens if we keep them as separate variables.

// ## setup()

function setup() {
  createCanvas(600, 600);
  frameRate(60);
}

// ## draw()

function draw() {
  stepApp();
  drawApp();
}

// ## stepApp()

// We have two balls now, so `stepApp()` needs to be updated to handle that.
// Having the balls stored in two separate variables—rather than an array—leads to code duplication.
// Removing the duplication—keeping it [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)—will make the code shorter, easier to read, and easier to maintain.

// This code works, but two things stand out for clean-up in the next version:
// 1. factor the repeated code into a function.
// 2. move the ball data into an array

function stepApp() {
  // forces + physics
  ball.x += ball.deltaX;
  ball.y += ball.deltaY;

  ball2.x += ball2.deltaX;
  ball2.y += ball2.deltaY;

  // collisions
  if (ball.x > width - ball.radius) ball.deltaX = -abs(ball.deltaX);
  if (ball.y > height - ball.radius) ball.deltaY = -abs(ball.deltaY);
  if (ball.x < 0 + ball.radius) ball.deltaX = abs(ball.deltaX);
  if (ball.y < 0 + ball.radius) ball.deltaY = abs(ball.deltaY);

  if (ball2.x > width - ball2.radius) ball2.deltaX = -abs(ball2.deltaX);
  if (ball2.y > height - ball2.radius) ball2.deltaY = -abs(ball2.deltaY);
  if (ball2.x < 0 + ball2.radius) ball2.deltaX = abs(ball2.deltaX);
  if (ball2.y < 0 + ball2.radius) ball2.deltaY = abs(ball2.deltaY);
}

// ## drawApp()

// `drawApp()` also suffers from some code duplication.
function drawApp() {
  background(10);
  noStroke();
  fill(255, 0, 0);
  ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
  ellipse(ball2.x, ball2.y, ball2.radius * 2, ball2.radius * 2);
}
