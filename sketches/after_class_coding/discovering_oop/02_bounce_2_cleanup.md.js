// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// # Version 2

// This version does the same thing as Version 1, but cleans up the code style a bit.

// This version is written in a structured, procedural style.

// ## Describe State Data

// Version 1 had declared global variables using pretty vague names: `x`, `y`, `deltaX`, and `deltaY`.
// Here the names are changed to more specifically describe their role. The redundancy in these
// names strongly suggests this data should be organized into a data object, which will be done in the next version.

// This version introduces `ballRadius`, which is used by the step function
// to improve collision detection.

let ballX = 100;
let ballY = 10;
let ballDeltaX = 5;
let ballDeltaY = 7;
let ballRadius = 10;

// ## Setup
// This is the same as before.
function setup() {
  createCanvas(600, 600);
  frameRate(60);
}

// ## Draw

// I like to separate updating state and drawing. One reason to do this is simply better organization: updating state and drawing are different tasks, seperating code by task allows you to focus on one problem at a time.

// Here the `draw()` function just calls `stepApp()` to update state and `drawApp()` to draw the frame.
function draw() {
  stepApp();
  drawApp();
}

// ## stepApp()

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

// ## drawApp()

// The `drawApp()` function draws a frame of animation based on the program state. It should avoid changing state.
function drawApp() {
  background(10);
  noStroke();
  fill(255, 0, 0);
  ellipse(ballX, ballY, ballRadius * 2, ballRadius * 2);
}
