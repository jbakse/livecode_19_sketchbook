// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

"use strict";

let player;

class BallGuy {
  constructor() {
    this.x = random(500);
    this.y = 50;
    this.dX = 0;
    this.dY = 0;
    this.radius = 14;
    this.kR = 0;
    this.kF = 0.999;
  }
  step() {
    this.grounded = false;

    const time = 0.1;
    const gravity = 1;

    for (let l = 0; l < 10; l++) {
      // applying acceration forces
      this.dY += gravity * time;

      // air friction

      this.dY *= this.kF;

      // apply velocity to position
      this.x += this.dX * time;
      this.y += this.dY * time;

      if (this.y > 500 - this.radius) {
        this.y = 500 - this.radius;
        this.grounded = true;
        this.doubleJumps = 0;
        this.dY = -abs(this.dY) * this.kR;
      }
    }
  }
  draw() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

function setup() {
  createCanvas(500, 500);
  background(0, 50, 0);

  player = new BallGuy();

  frameRate(60);
}

function draw() {
  background(50);
  player.step();
  player.draw();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && (player.grounded || player.doubleJumps < 2)) {
    player.dY = -20;
    player.doubleJumps++;
  }
}

window.onkeydown = function () {};

window.addEventListener("keydown", (event) => {
  if (event.key === this.key && !this.isDown) {
    this.isDown = true;
    this.wasPressed = true;
    if (this.onPress) this.onPress();
  }
});
