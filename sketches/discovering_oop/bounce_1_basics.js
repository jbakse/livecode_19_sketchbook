//require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 1

// This is a very simple implementation of a bouncing ball animation. Each frame it
// moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in an imperative style. It is short and fairly clear but needs some
// clean-up before it should be expanded.

// ## Describe State Data

// This section declares and initializes our program state variables.
// The data is all stored in unorganized global variables. This is a key target for clean up.

// the horizontal position of the ball
let ballX = 100;
// the vertical position of the ball
let ballY = 10;
// the horizontal velocity of the ball
let ballDeltaX = 5;
// the vertical velocity of the ball
let deltaY = 7;

// ## Setup

// P5 calls the `setup()` function once at the beginning. First the code creates
// a canvas to draw into. Then it sets some general p5 settings.

window.setup = function() {
  createCanvas(600, 600);
  frameRate(60);
};

// > This code will be loaded as a Javascript module, encapsulating its scope.
// > P5 doesn't isn't module-aware, so we need to export `setup()` and `draw()`
// > as properties on the global `window` object where p5 expects them.

// ## Draw

// P5 calls `draw()` once per frame. The draw function should draw one frame of animation.
window.draw = function() {
  // clear the drawing
  background(40, 40, 40);

  // This part moves the ball based on its velocity.
  // This is a very basic physics simulation with a simple discreet numeric integration.
  ballX += ballDeltaX;
  ballY += deltaY;

  // This part bounces the ball off the edges of the screen.
  // This is a very basic collision detection and collision response.
  // This code does not take into account the width of the ball, a visible mistake.
  if (ballX > width) ballDeltaX = -abs(ballDeltaX);
  if (ballY > height) deltaY = -abs(deltaY);
  if (ballX < 0) ballDeltaX = abs(ballDeltaX);
  if (ballY < 0) deltaY = abs(deltaY);

  // draw the ball
  noStroke();
  fill(255, 0, 0);
  ellipse(ballX, ballY, 20, 20);
};
