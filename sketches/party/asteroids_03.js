// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload mousePressed keyPressed keyReleased keyTyped */
/* global partyConnect partyIsHost partyLoadShared partyLoadMyShared partyLoadGuestShareds partyEmit partySubscribe partyToggleInfo*/

const WIDTH = 800;
const HEIGHT = 800;

let me, guests;
let rocks;
let bullets;

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
    "jb_asteroids_03",
    "main"
  );

  rocks = partyLoadShared("rocks", { rocks: initRocks() });
  bullets = partyLoadShared("bullets", { bullets: initBullets() });
  me = partyLoadMyShared(initShip());
  guests = partyLoadGuestShareds({});
  partyToggleInfo(true);
  //   shared = partyLoadShared("shared", {});
}

function setup() {
  createCanvas(WIDTH, HEIGHT);

  window.addEventListener("keydown", (e) => e.preventDefault());

  partySubscribe("fire", onFire);
}

function draw() {
  background("black");

  handleInput(me);
  updateShip(me);

  if (partyIsHost()) {
    updateRocks();
    updateBullets();
  }
  for (const guest of guests) {
    drawShip(guest);
  }

  for (const rock of rocks.rocks) {
    drawRock(rock);
  }

  for (const bullet of bullets.bullets) {
    drawBullet(bullet);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === 65) input.left = true; // A
  if (keyCode === RIGHT_ARROW || keyCode === 68) input.right = true; // D
  if (keyCode === UP_ARROW || keyCode === 87) input.thrust = true; // W
  if (keyCode === DOWN_ARROW || keyCode === 83) input.reverse = true; // S
  if (keyCode === 32) fire();
  return false;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === 65) input.left = false;
  if (keyCode === RIGHT_ARROW || keyCode === 68) input.right = false;
  if (keyCode === UP_ARROW || keyCode === 87) input.thrust = false;
  if (keyCode === DOWN_ARROW || keyCode === 83) input.reverse = false;
}

function handleInput(ship) {
  if (input.left) turnShip(ship, -0.1);
  if (input.right) turnShip(ship, 0.1);
  if (input.thrust) thrustShip(ship, 0.2);
  if (input.reverse) thrustShip(ship, -0.2);
}

function fire() {
  partyEmit("fire", me);
}

// todo: can we merge some of these things? like  updateBullet and updateRock?
function onFire(ship) {
  if (partyIsHost()) {
    console.log("fire", ship);
    bullets.bullets.push({
      x: ship.x,
      y: ship.y,
      //   dX: ship.dX + 5 * cos(ship.angle),
      //   dY: ship.dY + 5 * sin(ship.angle),
      dX: 5 * cos(ship.angle),
      dY: 5 * sin(ship.angle),
    });
  }
}

function initShip() {
  const ship = {};
  ship.x = WIDTH * 0.5;
  ship.y = HEIGHT * 0.5;
  ship.dX = 0;
  ship.dY = 0;
  ship.angle = 0;
  return ship;
}

function updateShip(ship) {
  ship.x += ship.dX;
  ship.y += ship.dY;
  ship.dX *= 0.99;
  ship.dY *= 0.99;
  if (ship.x > width) ship.x = 0;
  if (ship.x < 0) ship.x = width;
  if (ship.y > height) ship.y = 0;
  if (ship.y < 0) ship.y = height;
}

function turnShip(ship, angle) {
  ship.angle += angle;
}

function thrustShip(ship, thrust) {
  ship.dX += thrust * cos(ship.angle);
  ship.dY += thrust * sin(ship.angle);
}

function drawShip(ship) {
  push();
  translate(ship.x, ship.y);
  rotate(ship.angle);
  fill("white");
  triangle(-10, -10, 15, 0, -10, 10);
  pop();
}

function initRocks() {
  const rocks = [];
  for (let i = 0; i < 10; i++) {
    rocks.push({
      x: random(0, WIDTH),
      y: random(0, HEIGHT),
      dX: random(-1, 1),
      dY: random(-1, 1),
      size: random(10, 50),
    });
  }
  return rocks;
}

function updateRocks() {
  for (const rock of rocks.rocks) {
    updateRock(rock);
  }
}

function updateRock(rock) {
  rock.x += rock.dX;
  rock.y += rock.dY;
  if (rock.x > width) rock.x = 0;
  if (rock.x < 0) rock.x = width;
  if (rock.y > height) rock.y = 0;
  if (rock.y < 0) rock.y = height;
}

function drawRock(rock) {
  push();
  translate(rock.x, rock.y);
  noFill();
  stroke("white");
  ellipse(0, 0, rock.size);
  pop();
}

function initBullets() {
  const bullets = [];
  return bullets;
}

function updateBullets() {
  for (const bullet of bullets.bullets) {
    updateBullet(bullet);
  }
}

function updateBullet(bullet) {
  bullet.x += bullet.dX;
  bullet.y += bullet.dY;
  if (bullet.x > width) bullet.x = 0;
  if (bullet.x < 0) bullet.x = width;
  if (bullet.y > height) bullet.y = 0;
  if (bullet.y < 0) bullet.y = height;
}

function drawBullet(bullet) {
  push();
  translate(bullet.x, bullet.y);
  fill("white");
  noStroke();
  ellipse(0, 0, 5);
  pop();
}
