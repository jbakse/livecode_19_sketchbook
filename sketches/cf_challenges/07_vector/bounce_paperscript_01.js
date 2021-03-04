// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.11.5/paper-full.min.js
// paperscript

/* globals Rectangle Point Path  */
/* exported onFrame */

// In Paperscript, `Rectangle` doesn't draw anything. Instead Rectangles represent rectangular boundaries.
var rect_bounds = new Rectangle(new Point(0, 0), new Point(500, 500));

// Create a Path from the rectangle, the Path represents a shape that should be drawn as part of the scene.
var rect_path = new Path.Rectangle(rect_bounds);

// Paperscript is a deffered—not immediate—renderer. We can change properties—like fillColor—of the path after we create it, before the scene is drawn.
rect_path.fillColor = "#333";

// Create a path in the shape of a circle. Paperscript lets you use simple arrays for points.
var circle_path = new Path.Circle([200, 250], 50);
circle_path.fillColor = "red";

// Keep track of the velocity of the ball as a point using Point. We could also store this as a property on the circle path itself.
var deltaPosition = new Point(5, 0);

// Paperscript calls onFrame repeatedly, like step in p5. When this function completes, Paperscript will rasterize the scene and show it.
function onFrame() {
  // Paperscript uses _operator overloading_ so you can use mathematic operators on Points.
  circle_path.position += deltaPosition;

  // detect a collision with the right wall
  if (circle_path.position.x > 500) {
    // start moving left
    deltaPosition.x = -Math.abs(deltaPosition.x);
    // change the color of the ellipse
    circle_path.fillColor = "green";
  }

  // detect a collision with the left wall
  if (circle_path.position.x < 0) {
    // start moving right
    deltaPosition.x = Math.abs(deltaPosition.x);
    // change the color of the ellipse
    circle_path.fillColor = "blue";
  }
}
