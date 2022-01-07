// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// # Version 1

// This is a very simple implementation of a bouncing ball animation. Each frame it
// moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in an imperative style. It is short and fairly clear, but it needs some
// clean-up before it should be expanded.

// ## Describe State Data

// This section declares and initializes our program state variables.
// The data is all stored in unorganized global variables. This is a key target for clean up.

// Horizontal position of the ball:
let x = 100;
// Vertical position of the ball:
let y = 10;
// Horizontal velocity of the ball:
let deltaX = 5;
// Vertical velocity of the ball:
let deltaY = 7;

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
  x += deltaX;
  y += deltaY;

  // This part bounces the ball off the edges of the screen.
  // This is a very basic collision detection and collision response.
  // This code does not take into account the width of the ball, a visible mistake.
  if (x > width) deltaX = -abs(deltaX);
  if (y > height) deltaY = -abs(deltaY);
  if (x < 0) deltaX = abs(deltaX);
  if (y < 0) deltaY = abs(deltaY);

  // draw the ball
  noStroke();
  fill(255, 0, 0);
  ellipse(x, y, 20, 20);
}
