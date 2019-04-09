// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 2

// This is a very simple implementation of a bouncing ball animation. Each frame it moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in a structured, procedural style. The data is organized into a data object.

// ## Describe State Data

// Move the data into a POD, Plain Old Data object. This doesn't change the program very much, but
// more organized data will be easier to work with as the program grows.

let ball = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10,
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

function stepApp() {
  // forces + physics
  ball.x += ball.deltaX;
  ball.y += ball.deltaY;

  // collisions
  if (ball.x > width - ball.radius) ball.deltaX = -abs(ball.deltaX);
  if (ball.y > height - ball.radius) ball.deltaY = -abs(ball.deltaY);
  if (ball.x < 0 + ball.radius) ball.deltaX = abs(ball.deltaX);
  if (ball.y < 0 + ball.radius) ball.deltaY = abs(ball.deltaY);
}

// ## DrawApp

function drawApp() {
  background(0, 0, 0.2);
  noStroke();
  fill(0, 1, 1);
  ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
}
