// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// # Version 8a

// This version doesn't change the program behavior. It does change how the behavior is expressed. This example moves from procedural approach to an object oriented approach.

// There are multiple methods to express objects in Javascript. This demo uses the _constructor_ method.

// calling `new Constructor()`
// 1. creates an empty, plain Javascript object
// 2. sets the constructor
// 3. the new object's __proto_ is set the the prototype of the constructor function. Note: functions are objects! they have properties and everything
// 4. the constructor function is called with `this` bound to the new object
// 5. the new object is returned (or an alternate object if the constructor function explicity returns one)

// The big shift here is the introduciton of objects. Objects are an organizational unit that collects both data and the functions that work with that data.

// In the last version of this program the `stepBall()` and `drawBall()` functions received their data as parameters. In this version, they are moved into the object as `ball.step()` and `ball.draw()`

// Now that they are in the object, they can access their data via the `this` keyword. A major benefit of this shift is that the calling code no longer needs to keep track of which data and methods work together.

// One thing to note about this version is that every Ball instance has its own copy of the `step` and `draw` functions. Since they are all the same, we could save some resources if all the instances shared a single copy of these functions. That will happen in 8b.

let balls = [];

function Ball(x, y, deltaX, deltaY, radius) {
  this.x = x;
  this.y = y;
  this.deltaX = deltaX;
  this.deltaY = deltaY;
  this.radius = radius;

  this.step = function () {
    this.x += this.deltaX;
    this.y += this.deltaY;

    if (this.x > width - this.radius) this.deltaX = -abs(this.deltaX);
    if (this.y > height - this.radius) this.deltaY = -abs(this.deltaY);
    if (this.x < 0 + this.radius) this.deltaX = abs(this.deltaX);
    if (this.y < 0 + this.radius) this.deltaY = abs(this.deltaY);
  };

  this.draw = function () {
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    pop();
  };
}

function setup() {
  createCanvas(600, 600);
  frameRate(60);

  for (let i = 0; i < 50; i++) {
    balls.push(new Ball(300, 300, random(-5, 5), random(-5, 5), random(5, 20)));
  }
}

function draw() {
  stepApp();
  drawApp();
}

function stepApp() {
  for (const ball of balls) {
    ball.step();
  }
}

function drawApp() {
  background(10);
  for (const ball of balls) {
    ball.draw();
  }
}
