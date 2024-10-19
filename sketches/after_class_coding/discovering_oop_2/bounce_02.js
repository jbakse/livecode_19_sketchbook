// bounce_02.js
// This is a very simple implementation of a bouncing ball animation.
// The ball in a straight line, bouncing it when it hits the edge of the screen.

// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// declare and initialize our program state variables
const balls = [
  { x: 100, y: 10, deltaX: 5, deltaY: 7 },
  { x: 200, y: 10, deltaX: 4, deltaY: 9 },
  { x: 200, y: 10, deltaX: 2, deltaY: 9 },
];

// set up p5 canvas and drawing properties
function setup() {
  createCanvas(600, 600);
  noStroke();
  fill("white");
}

function draw() {
  update();
  render();
}

// this function changes the state, and doesn't draw anything
function update() {
  // loop through every ball in array
  for (const ball of balls) {
    // move the balls based on their velocity.
    ball.x += ball.deltaX;
    ball.y += ball.deltaY;

    // bounce the balls off the edges of the screen.
    if (ball.x > width) ball.deltaX = -abs(ball.deltaX);
    if (ball.y > height) ball.deltaY = -abs(ball.deltaY);
    if (ball.x < 0) ball.deltaX = abs(ball.deltaX);
    if (ball.y < 0) ball.deltaY = abs(ball.deltaY);
  }
}

// this function draws the state, and doesn't change anything
function render() {
  // clear the drawing
  background("gray");

  // draw the balls
  for (const ball of balls) {
    ellipse(ball.x, ball.y, 20, 20);
  }
}
