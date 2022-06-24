// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// Bouncing Ball Example with three options for iterating the `balls` array.

// https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript

const balls = [];
function setup() {
  createCanvas(512, 512);

  for (let i = 0; i < 10; i++) {
    balls.push(
      new Ball(random(width), random(height), random(-10, 10), random(-10, 10))
    );
  }
}

function draw() {
  background("black");

  // using `for` loops
  // https://mdn.io/for

  for (let i = 0; i < balls.length; i++) {
    balls[i].step();
  }
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
  }

  // using `for...of` loops
  // https://mdn.io/for...of

  for (const b of balls) {
    b.step();
  }
  for (const b of balls) {
    b.draw();
  }

  // using `forEach`
  // https://mdn.io/forEach

  balls.forEach((b) => b.step());
  balls.forEach((b) => b.draw());
}

class Ball {
  constructor(x, y, dX, dY) {
    this.x = x;
    this.y = y;
    this.dX = dX;
    this.dY = dY;
    this.r = 10;
  }

  step() {
    // move the ball
    this.x += this.dX;
    this.y += this.dY;

    // bounce off walls
    if (this.x > width - this.r) this.dX = -abs(this.dX);
    if (this.x < this.r) this.dX = abs(this.dX);
    if (this.y > height - this.r) this.dY = -abs(this.dY);
    if (this.y < this.r) this.dY = abs(this.dY);
  }

  draw() {
    push();
    fill("red");
    noStroke();
    ellipseMode(RADIUS);
    ellipse(this.x, this.y, this.r, this.r);
    pop();
  }
}
