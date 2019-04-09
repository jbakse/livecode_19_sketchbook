// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 2

// This is a very simple implementation of a bouncing ball animation. Each frame it moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in a structured, procedural style. The data is organized into a data object.

// ## Describe State Data

// Now we have two balls. Names like `ball2` are a pretty good indication that an array is called for.
// But first, lets see what happens if we keep them as separate variables.

let ball = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10,
};

let ball2 = {
  x: 200,
  y: 10,
  deltaX: 7,
  deltaY: 6,
  radius: 20,
};

// ## Setup

window.setup = function() {
  createCanvas(600, 600);
  colorMode(HSB, 1);
  frameRate(60);
};

// ## Draw

window.draw = function() {
  stepApp();
  drawApp();
};

// ## StepApp

// Having the balls stored in two unrelated variables, rather than an array leads to code duplication.
// Two things stand out for cleanup:
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

// ## DrawApp

function drawApp() {
  background(0, 0, 0.2);
  noStroke();
  fill(0, 1, 1);
  ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
  ellipse(ball2.x, ball2.y, ball2.radius * 2, ball2.radius * 2);
}
