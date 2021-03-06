// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 1

// This is a very simple implementation of a bouncing ball animation. Each frame it
// moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in an imperative style. It is short and fairly clear, but it needs some
// clean-up before it should be expanded.

// ## Describe State Data

// This section declares and initializes our program state variables.
// The data is all stored in unorganized global variables. This is a key target for clean up.

// Horizontal position of the ball:
let ballX = 100;
// Vertical position of the ball:
let ballY = 10;
// Horizontal velocity of the ball:
let ballDeltaX = 5;
// Vertical velocity of the ball:
let ballDeltaY = 7;

// ## setup()

// [p5.js](https://p5js.org) calls the `setup()` function once at the beginning. Here, `setup()` creates
// a canvas to draw into and sets the frame rate.

function setup() {
  createCanvas(600, 600);
  frameRate(60);
}

// ## draw()

// p5 calls `draw()` once per frame. The draw function should draw one frame of animation.
function draw() {
  // clear the drawing
  background(10, 10, 10);

  // This part moves the ball based on its velocity.
  // This is a very basic physics simulation using discreet numeric integration.
  ballX += ballDeltaX;
  ballY += ballDeltaY;

  // This part bounces the ball off the edges of the screen.
  // This is a very basic collision detection and collision response.
  // This code does not take into account the width of the ball, a visible mistake.
  if (ballX > width) ballDeltaX = -abs(ballDeltaX);
  if (ballY > height) ballDeltaY = -abs(ballDeltaY);
  if (ballX < 0) ballDeltaX = abs(ballDeltaX);
  if (ballY < 0) ballDeltaY = abs(ballDeltaY);

  // draw the ball
  noStroke();
  fill(255, 0, 0);
  ellipse(ballX, ballY, 20, 20);
}
