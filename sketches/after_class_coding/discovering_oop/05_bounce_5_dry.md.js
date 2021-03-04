// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 5

// This version refactors the code to move and draw the ball into functions.

// This reduces code [repetition](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Reducing repetion in code is usually a good thing. It makes the code shorter, easier to read, and easier to maintain.

// This version focuses on improving the procedural structure of the code, the next version will improve the structure of the data.

// ## Describe State Data

let ball = {
  x: 100,
  y: 10,
  deltaX: 5,
  deltaY: 7,
  radius: 10,
};

let ball2 = {
  x: 200,
  y: 10,
  deltaX: 7,
  deltaY: 6,
  radius: 20,
};

// ## setup()

function setup() {
  console.log("s");
  createCanvas(600, 600);
  frameRate(60);
}

// ## draw()

function draw() {
  stepApp();
  drawApp();
}

// ## stepApp()

// The code from `stepApp()` has been [factored](https://en.wikipedia.org/wiki/Code_refactoring) into a function `stepBall()`.
// `stepApp()` can call `stepBall()` twice, once for each ball, so we don't need to duplicate its code.
function stepApp() {
  stepBall(ball);
  stepBall(ball2);
}

// `stepBall()` takes a parameter: the data of the ball it should move. It relies on recieving the correct kind of data: a data object  with `x`, `y`, `deltaX`, `deltaY`, and `radius` fields.
// If `stepBall()` is called with something else it will throw errors when it tries to access fields that don't exist.

function stepBall(b) {
  // forces + physics
  b.x += b.deltaX;
  b.y += b.deltaY;

  // collisions
  if (b.x > width - b.radius) b.deltaX = -abs(b.deltaX);
  if (b.y > height - b.radius) b.deltaY = -abs(b.deltaY);
  if (b.x < 0 + b.radius) b.deltaX = abs(b.deltaX);
  if (b.y < 0 + b.radius) b.deltaY = abs(b.deltaY);
}

// ## drawApp()

// like `stepApp()`, `drawApp()` has been refactored an can now call `drawBall()` to draw the balls.
function drawApp() {
  background(10);
  drawBall(ball);
  drawBall(ball2);
}

// `drawBall()` draws the ball represented by the data passed to it.

// It uses `push()` and `pop()` to isolate any p5 state changes.
// Without `push()` and `pop()`, this function would have two side effects
// —changing the fill color and disabling stroke—that would spill into future
// drawing elsewhere in the code

function drawBall(b) {
  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(b.x, b.y, b.radius * 2, b.radius * 2);
  pop();
}
