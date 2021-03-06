// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// # Version 8b

// This version has the same behavior as 8a, but changes how the `step()` and `draw()` functions are handled.

// In 8a, these functions were duplicated for every instance of Ball. That was unnecessary because these functions are the same for every instance. It is pretty common that the value of data members like `x` and `y` are different between instances while instance methods/functions like `step()` and `draw()` are shared.

// Javascript provides _prototypical delegation_ as a method for sharing data between objects. In short, each object has an internal link to another object, the linked object is refered to as it's _prototype_. If you try to access a property of an object that doesn't exist, Javascript will look to see if the object's prototype has the property, and use the prototype's property's value instead.

// When you create an object instance using `new Constructor()` javascript sets the new object's prototye to the Constructor funciton's prototype.

// The practical effect of his is that you can put shared methods on a Constructor function's prototype, and those methods will be usable by all the instance objects it constructs.

let balls = [];

function Ball(x, y, deltaX, deltaY, radius) {
  this.x = x;
  this.y = y;
  this.deltaX = deltaX;
  this.deltaY = deltaY;
  this.radius = radius;
}

Ball.prototype.step = function () {
  this.x += this.deltaX;
  this.y += this.deltaY;

  if (this.x > width - this.radius) this.deltaX = -abs(this.deltaX);
  if (this.y > height - this.radius) this.deltaY = -abs(this.deltaY);
  if (this.x < 0 + this.radius) this.deltaX = abs(this.deltaX);
  if (this.y < 0 + this.radius) this.deltaY = abs(this.deltaY);
};

Ball.prototype.draw = function () {
  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  pop();
};

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
