// bounce_01.js
// This is a very simple implementation of a bouncing ball animation.
// The ball in a straight line, bouncing it when it hits the edge of the screen.

// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// declare and initialize our program state variables.
let x = 100;
let y = 10;
let deltaX = 5;
let deltaY = 7;
let x2 = 200;
let y2 = 10;
let deltaX2 = 4;
let deltaY2 = 9;

function setup() {
  createCanvas(600, 600);
  noStroke();
  fill("white");
}

function draw() {
  // clear the drawing
  background("gray");

  // move the balls based on their velocity.
  x += deltaX;
  y += deltaY;
  x2 += deltaX2;
  y2 += deltaY2;

  // bounce the balls off the edges of the screen.
  if (x > width) deltaX = -abs(deltaX);
  if (y > height) deltaY = -abs(deltaY);
  if (x < 0) deltaX = abs(deltaX);
  if (y < 0) deltaY = abs(deltaY);

  if (x2 > width) deltaX2 = -abs(deltaX2);
  if (y2 > height) deltaY2 = -abs(deltaY2);
  if (x2 < 0) deltaX2 = abs(deltaX2);
  if (y2 < 0) deltaY2 = abs(deltaY2);

  // draw the balls
  ellipse(x, y, 20, 20);
  ellipse(x2, y2, 20, 20);
}
