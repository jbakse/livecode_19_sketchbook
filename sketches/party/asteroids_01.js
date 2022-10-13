// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload mousePressed keyPressed keyReleased keyTyped */
/* global partyConnect  */

// let shared;

const input = {
  left: false,
  right: false,
  thrust: false,
  reverse: false,
};
let ship;

function preload() {
  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "jb_asteroids_01",
    "main"
  );

  //   shared = partyLoadShared("shared", {});
}

function setup() {
  createCanvas(800, 800);

  window.addEventListener("keydown", (e) => e.preventDefault());

  ship = new Ship();
}

function draw() {
  handleInput();

  ship.step();

  background("black");
  ship.draw();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === 65) input.left = true;
  if (keyCode === RIGHT_ARROW || keyCode === 68) input.right = true;
  if (keyCode === UP_ARROW || keyCode === 87) input.thrust = true;
  if (keyCode === DOWN_ARROW || keyCode === 83) input.reverse = true;
  return false;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === 65) input.left = false;
  if (keyCode === RIGHT_ARROW || keyCode === 68) input.right = false;
  if (keyCode === UP_ARROW || keyCode === 87) input.thrust = false;
  if (keyCode === DOWN_ARROW || keyCode === 83) input.reverse = false;
}

function handleInput() {
  if (input.left) ship.turn(-0.1);
  if (input.right) ship.turn(0.1);
  if (input.thrust) ship.thrust(0.2);
  if (input.reverse) ship.thrust(-0.2);
}

class Ship {
  constructor() {
    this.x = width * 0.5;
    this.y = height * 0.5;
    this.dX = 0;
    this.dY = 0;
    this.angle = 0;
  }
  step() {
    this.x += this.dX;
    this.y += this.dY;
    this.dX *= 0.99;
    this.dY *= 0.99;
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }
  turn(angle) {
    this.angle += angle;
  }
  thrust(thrust) {
    this.dX += thrust * cos(this.angle);
    this.dY += thrust * sin(this.angle);
    console.log(this.dx, this.dy);
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill("white");
    triangle(-10, -10, 15, 0, -10, 10);
    pop();
  }
}
