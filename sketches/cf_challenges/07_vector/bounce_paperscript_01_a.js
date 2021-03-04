// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.11.5/paper-full.min.js
// language paperscript

/* globals Rectangle Point Path  */
/* exported onFrame */

// ?
var rect_bounds = new Rectangle(new Point(0, 0), new Point(500, 500));

// ?
var rect_path = new Path.Rectangle(rect_bounds);

// ?
rect_path.fillColor = "#333";

// ?
var circle_path = new Path.Circle([200, 250], 50);
circle_path.fillColor = "red";

// ?
var deltaPosition = new Point(5, 0);

// ?
function onFrame() {
  // ?
  circle_path.position += deltaPosition;

  // ?
  if (circle_path.position.x > 500) {
    // ?
    deltaPosition.x = -Math.abs(deltaPosition.x);
    // ?
    circle_path.fillColor = "green";
  }

  // ?
  if (circle_path.position.x < 0) {
    // ?
    deltaPosition.x = Math.abs(deltaPosition.x);
    // ?
    circle_path.fillColor = "blue";
  }
}

// Create a path in the shape of a circle. Paperscript lets you use simple arrays for points.
// start moving left
// Paperscript is a deffered—not immediate—renderer. We can change properties—like fillColor—of the path after we create it, before the scene is drawn.
// detect a collision with the right wall
// Create a Path from the rectangle, the Path represents a shape that should be drawn as part of the scene.
// change the color of the ellipse
// In Paperscript, `Rectangle` doesn't draw anything. Instead Rectangles represent rectangular boundaries.
// Keep track of the velocity of the ball as a point using Point. We could also store this as a property on the circle path itself.
// Paperscript uses _operator overloading_ so you can use mathematic operators on Points.
// detect a collision with the left wall
// change the color of the ellipse
// start moving right
// Paperscript calls onFrame repeatedly, like step in p5. When this function completes, Paperscript will rasterize the scene and show it.
