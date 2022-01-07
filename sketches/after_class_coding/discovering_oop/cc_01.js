// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

/* exported setup draw */

// DRY - Don't Repeat Yourself

const balls = [
  {
    x: 400,
    y: 100,
    deltaX: 3,
    deltaY: 3,
    moveBall: moveBall,
    drawBall: drawBall,
  },

  {
    x: 200,
    y: 100,
    deltaX: 1,
    deltaY: 3,
    moveBall: moveBall,
    drawBall: drawBall,
  },

  {
    x: 300,
    y: 200,
    deltaX: 1,
    deltaY: 3,
    moveBall: moveBall,
    drawBall: function () {
      rect(this.x, this.y, 50, 50);
    },
  },

  {
    x: 200,
    y: 200,
    deltaX: 1,
    deltaY: 3,
    moveBall: moveBall,
    drawBall: drawBall,
  },
];

function setup() {
  createCanvas(600, 600);
  frameRate(60);
}

function moveBall() {
  this.x = this.x + this.deltaX;
  this.y = this.y + this.deltaY;

  if (this.x > 600) {
    this.deltaX = -abs(this.deltaX);
  }

  if (this.y > 600) {
    this.deltaY = -abs(this.deltaY);
  }

  if (this.x < 0) {
    this.deltaX = abs(this.deltaX);
  }

  if (this.y < 0) {
    this.deltaY = abs(this.deltaY);
  }
}

function drawBall() {
  ellipse(this.x, this.y, 50, 50);
}

function stepScene() {
  // apply momentum
  for (const ball of balls) {
    ball.moveBall();
  }
}

function drawScene() {
  // drawing
  background(100);
  for (const ball of balls) {
    ball.drawBall();
  }
}

function draw() {
  stepScene();
  drawScene();
}
