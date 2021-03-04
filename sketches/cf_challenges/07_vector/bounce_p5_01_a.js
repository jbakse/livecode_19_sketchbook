// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* global p5 */
/* exported setup draw */

// ?
let deltaPosition = new p5.Vector(5, 0);

// ?
let circlePosition = new p5.Vector(250, 250);

// ?
let circleColor = "red";

function setup() {
  // ?
  createCanvas(512, 512);
  background("white");

  // ?
  noStroke();
}

// ?
function draw() {
  // ?
  fill("#333");

  // ?
  rect(0, 0, 500, 500);

  // ?
  circlePosition.x += deltaPosition.x;
  circlePosition.y += deltaPosition.y;

  // ?
  if (circlePosition.x > 500) {
    // ?
    deltaPosition.x = -Math.abs(deltaPosition.x);
    // ?
    circleColor = "green";
  }

  // ?
  if (circlePosition.x < 0) {
    // ?
    deltaPosition.x = Math.abs(deltaPosition.x);
    // ?
    circleColor = "blue";
  }

  // ?
  fill(circleColor);

  // ?
  ellipse(circlePosition.x, circlePosition.y, 100, 100);
}

// Rasterize a rectangle right now.
// p5 calls this function repeatedly. Each time this function completes, the canvas is updated with the resulting drawing.
// Declare variable to track of the color of our circle
// detect a collision with the left wall
// Declare variable to track of the velocity of the ball as a point using p5.Vector.
// Set the global fill color to dark gray.
// change the global fill color state to the color we want our circle to be
// we can't add two points together, we have to add the components of the points.
// remember that we want to draw the circle in green
// start moving left
// rasterize our circle right now
// start moving right
// detect a collision with the right wall
// Turn off stroke drawing globally.
// remember that we want to draw the circle in blue
// Create the canvas from Javascript. Paperscript uses an existing canvas instead.
// Declare variable to track of the position of our circle.
