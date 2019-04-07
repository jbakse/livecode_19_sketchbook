// # Version 2

// This is a very simple implementation of a bouncing ball animation. Each frame it moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in a structured, procedural style.

// ## Describe State Data

// x, y, deltaX, and deltaY are pretty vague names for global variables.
// They are changed to more specifically describe their role. The redundancy in these
// names strongly suggests this data should be organized into a data object.
// This version introduces `ballRadius`, which is used by the step function
// to improve collision detection.

let ballX = 100;
let ballY = 10;
let ballDeltaX = 5;
let ballDeltaY = 7;
let ballRadius = 10;

// ## Setup

// In addition to creating the canvas, I also set up the p5 environment to use HSB colorMode.

window.setup = function() {
  createCanvas(600, 600);
  colorMode(HSB, 1);
  frameRate(60);
};

// ## Draw

// I like to separate updating state and drawing, so my draw() function is usually just redirects to functions that do those things.
window.draw = function() {
  stepApp();
  drawApp();
};

// ## StepApp

// The `stepApp()` function updates the program state. It should avoid drawing.
function stepApp() {
  // forces + physics
  ballX += ballDeltaX;
  ballY += ballDeltaY;

  // collisions
  if (ballX > width - ballRadius) ballDeltaX = -abs(ballDeltaX);
  if (ballY > height - ballRadius) ballDeltaY = -abs(ballDeltaY);
  if (ballX < 0 + ballRadius) ballDeltaX = abs(ballDeltaX);
  if (ballY < 0 + ballRadius) ballDeltaY = abs(ballDeltaY);
}

// ## DrawApp

// The `drawApp()` function draws a frame of animation based on the program state. It should avoid changing state.
function drawApp() {
  background(0, 0, 0.2);
  noStroke();
  fill(0, 1, 1);
  ellipse(ballX, ballY, ballRadius * 2, ballRadius * 2);
}
