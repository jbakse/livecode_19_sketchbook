// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* global p5 */
/* exported setup draw */

// Declare variable to track of the velocity of the ball as a point using p5.Vector.
let deltaPosition = new p5.Vector(5, 0);

// Declare variable to track of the position of our circle.
let circlePosition = new p5.Vector(250, 250);

// Declare variable to track of the color of our circle
let circleColor = "red";

function setup() {
  // Create the canvas from Javascript. Paperscript uses an existing canvas instead.
  createCanvas(512, 512);
  background("white");

  // Turn off stroke drawing globally.
  noStroke();
}

// p5 calls this function repeatedly. Each time this function completes, the canvas is updated with the resulting drawing.
function draw() {
  // Set the global fill color to dark gray.
  fill("#333");

  // Rasterize a rectangle right now.
  rect(0, 0, 500, 500);

  // we can't add two points together, we have to add the components of the points.
  circlePosition.x += deltaPosition.x;
  circlePosition.y += deltaPosition.y;

  // detect a collision with the right wall
  if (circlePosition.x > 500) {
    // start moving left
    deltaPosition.x = -Math.abs(deltaPosition.x);
    // remember that we want to draw the circle in green
    circleColor = "green";
  }

  // detect a collision with the left wall
  if (circlePosition.x < 0) {
    // start moving right
    deltaPosition.x = Math.abs(deltaPosition.x);
    // remember that we want to draw the circle in blue
    circleColor = "blue";
  }

  // change the global fill color state to the color we want our circle to be
  fill(circleColor);

  // rasterize our circle right now
  ellipse(circlePosition.x, circlePosition.y, 100, 100);
}
