a; // # Version 2

// This is a very simple implementation of a bouncing ball animation. Each frame it moves the ball in a straight line, bouncing it when it hits the edge of the screen.

// This version is written in a basic imperative style.

// ## Describe State Data

// This section declares and initializes our program state variables.
// The data is all stored in unorganized global variables. This is a key target for clean up.
let x = 100;
let y = 10;
let deltaX = 5;
let deltaY = 7;

// ## Setup

// P5 calls the `setup()` function once at the beginning. First the code creates a canvas to draw into. Then it sets some general p5 settings.

window.setup = function() {
  createCanvas(600, 600);
  colorMode(HSB, 1);
  frameRate(60);
};

// > This code will be loaded as a Javascript module, encapsulating its scope. P5 doesn't isn't module-aware, so we need to export `setup()` and `draw()` as properties on the global `window` object where p5 expects them.

// ## Draw

// P5 calls `draw()` once per frame. The draw function should draw one frame of animation.
window.draw = function() {
  // clear the drawing
  background(0, 0, 0.2);

  // This part moves the ball based on its velocity.
  // This is a very basic physics simulation with a simple discreet numeric integration.
  x += deltaX;
  y += deltaY;

  // This part bounces the ball off the edges of the screen.
  // This is a very basic collision detection and collision response.
  if (x > width) deltaX = -abs(deltaX);
  if (y > height) deltaY = -abs(deltaY);
  if (x < 0) deltaX = abs(deltaX);
  if (y < 0) deltaY = abs(deltaY);

  // draw the ball
  noStroke();
  fill(0, 1, 1);
  ellipse(x, y, 20, 20);
};
