// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// # Version 3

// In this version the data is organized into a [plain-old-data](https://en.wikipedia.org/wiki/Passive_data_structure) object.
// Using the data object explicity groups the related data, making the code more readable.

// ## Describe State Data

// Group the data into a Plain Old Data object. This doesn't change the program very much, but
// more organized data will be easier to work with as the program grows.

let ball = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10,
};

// ## setup()

function setup() {
  createCanvas(600, 600);
  frameRate(60);
}

// ## draw()

function draw() {
  stepApp();
  drawApp();
}

// ## stepApp()

// This fucntion is mostly the same, but now variables are now accessed through "dot" notation.
// When reading this code it is clear that `x`, `y`, `deltaX`, `deltaY`, and `radius` are all properties of `ball`.

function stepApp() {
  // forces + physics
  ball.x += ball.deltaX;
  ball.y += ball.deltaY;

  // collisions
  if (ball.x > width - ball.radius) ball.deltaX = -abs(ball.deltaX);
  if (ball.y > height - ball.radius) ball.deltaY = -abs(ball.deltaY);
  if (ball.x < 0 + ball.radius) ball.deltaX = abs(ball.deltaX);
  if (ball.y < 0 + ball.radius) ball.deltaY = abs(ball.deltaY);
}

// ## drawApp()

function drawApp() {
  background(10);
  noStroke();
  fill(255, 0, 0);
  ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
}
