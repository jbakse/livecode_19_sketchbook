// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload mousePressed keyPressed keyReleased keyTyped */
/* global partyConnect partyLoadMyShared partyLoadGuestShareds partySetShared */

const WIDTH = 800;
const HEIGHT = 800;

let me, guests;

const input = {
  left: false,
  right: false,
  thrust: false,
  reverse: false,
};

function preload() {
  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "jb_asteroids_02",
    "main"
  );

  const ship = new Ship();

  me = partyLoadMyShared(ship.serialize());
  guests = partyLoadGuestShareds({});

  //   shared = partyLoadShared("shared", {});
}

function setup() {
  createCanvas(WIDTH, HEIGHT);

  window.addEventListener("keydown", (e) => e.preventDefault());
}

function draw() {
  background("black");

  // note: this creates a lot of objects for garbage collection
  // note: this approach does not (easily) allow ships to communicate or react to each other
  // note: another option is creating persistent ship instances and updating them might work for a fixed player count game. But if every client has a ship, we'd need to creat and delete ships as players join and leave, which might be too much boilerplate.. mabye look at this

  const myShip = new Ship();
  myShip.deserialize(me);
  handleInput(myShip);
  myShip.update();
  partySetShared(me, myShip.serialize());

  for (const guest of guests) {
    const ship = new Ship();
    ship.deserialize(guest);

    ship.draw();
  }
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

function handleInput(ship) {
  if (input.left) ship.turn(-0.1);
  if (input.right) ship.turn(0.1);
  if (input.thrust) ship.thrust(0.2);
  if (input.reverse) ship.thrust(-0.2);
}

class Ship {
  constructor() {
    this.x = WIDTH * 0.5;
    this.y = HEIGHT * 0.5;
    this.dX = 0;
    this.dY = 0;
    this.angle = 0;
  }
  serialize() {
    // todo can this be done with spread or apply?
    return {
      x: this.x,
      y: this.y,
      dX: this.dX,
      dY: this.dY,
      angle: this.angle,
      test: "test",
    };
  }
  deserialize(data) {
    this.x = data.x;
    this.y = data.y;
    this.dX = data.dX;
    this.dY = data.dY;
    this.angle = data.angle;
  }

  update() {
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
