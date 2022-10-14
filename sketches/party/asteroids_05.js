// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload mousePressed keyPressed keyReleased keyTyped */
/* global partyConnect partyIsHost partyLoadShared partyLoadMyShared partyLoadGuestShareds partySetShared partyEmit partySubscribe partyToggleInfo*/

const WIDTH = 800;
const HEIGHT = 800;

let me, guests;
let hostData;

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
    "jb_asteroids_05",
    "main"
  );

  hostData = partyLoadShared("host", { rocks: initRocks() });
  me = partyLoadMyShared(initShip());
  guests = partyLoadGuestShareds({});

  partySubscribe("rockHit", onRockHit);
  partyToggleInfo(true);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noFill();
  noStroke();

  window.addEventListener("keydown", (e) => e.preventDefault());
}

function draw() {
  background("black");

  handleInput(me);
  updateShip(me);

  if (partyIsHost()) {
    updateRocks();
  }
  for (const guest of guests) {
    drawShip(guest);
  }

  for (const rock of hostData.rocks) {
    drawRock(rock);
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
  if (input.left) turnShip(ship, -0.05);
  if (input.right) turnShip(ship, 0.05);
  if (input.thrust) thrustShip(ship, 0.1);
  if (input.reverse) thrustShip(ship, -0.1);
}

function fire() {
  if (!me.alive) return;
  me.bullets.push({
    x: me.x,
    y: me.y,
    //   dX: ship.dX + 5 * cos(ship.angle),
    //   dY: ship.dY + 5 * sin(ship.angle),
    dX: 5 * cos(me.angle),
    dY: 5 * sin(me.angle),
    age: 0,
  });
}

// //////////////////////////////////////////////////
// SHIP

function initShip() {
  const ship = {};
  ship.alive = true;
  ship.x = WIDTH * 0.5;
  ship.y = HEIGHT * 0.5;
  ship.dX = 0;
  ship.dY = 0;
  ship.angle = 0;
  ship.bullets = [];
  return ship;
}

function updateShip(ship) {
  if (!ship.alive) return;
  ship.x += ship.dX;
  ship.y += ship.dY;
  ship.dX *= 0.99;
  ship.dY *= 0.99;
  if (ship.x > width) ship.x = 0;
  if (ship.x < 0) ship.x = width;
  if (ship.y > height) ship.y = 0;
  if (ship.y < 0) ship.y = height;

  for (const rock of hostData.rocks) {
    if (dist(me.x, me.y, rock.x, rock.y) < rock.size * 0.5) {
      partyEmit("rockHit", rock.id);
      me.alive = false;
      // eslint-disable-next-line
      setTimeout(() => {
        partySetShared(me, initShip());
      }, 3000);
    }
  }

  for (const bullet of me.bullets) {
    updateBullet(bullet);
  }
  me.bullets = me.bullets.filter((bullet) => bullet.age < 100);
}

function turnShip(ship, angle) {
  ship.angle += angle;
}

function thrustShip(ship, thrust) {
  ship.dX += thrust * cos(ship.angle);
  ship.dY += thrust * sin(ship.angle);
}

function drawShip(ship) {
  if (!ship.alive) return;
  push();
  translate(ship.x, ship.y);
  rotate(ship.angle);
  fill("white");
  triangle(-10, -10, 15, 0, -10, 10);
  pop();

  for (const bullet of ship.bullets) {
    drawBullet(bullet);
  }
}

// //////////////////////////////////////////////////
// BULLETS

function updateBullet(bullet) {
  bullet.age++;

  bullet.x += bullet.dX;
  bullet.y += bullet.dY;
  if (bullet.x > width) bullet.x = 0;
  if (bullet.x < 0) bullet.x = width;
  if (bullet.y > height) bullet.y = 0;
  if (bullet.y < 0) bullet.y = height;

  for (const rock of hostData.rocks) {
    if (dist(bullet.x, bullet.y, rock.x, rock.y) < rock.size * 0.5) {
      bullet.age += 1000000;
      partyEmit("rockHit", rock.id);
    }
  }
}

function drawBullet(bullet) {
  push();
  translate(bullet.x, bullet.y);
  fill("white");
  noStroke();
  ellipse(0, 0, 5);
  pop();
}

// //////////////////////////////////////////////////
// ROCKS

function initRocks() {
  const rocks = [];
  for (let i = 0; i < 10; i++) {
    rocks.push({
      x: random(0, WIDTH),
      y: random(0, HEIGHT),
      dX: random(-1, 1),
      dY: random(-1, 1),
      size: random([16, 32, 64]),
      id: i,
    });
  }
  return rocks;
}

function updateRocks() {
  for (const rock of hostData.rocks) {
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

function onRockHit(rockId) {
  if (!partyIsHost()) return;
  const rock = hostData.rocks.find((rock) => rock.id === rockId);
  if (rock.size > 16) {
    const newSize = rock.size / 2;
    hostData.rocks.push({
      x: rock.x,
      y: rock.y,
      dX: rock.dX + random(-1, 1),
      dY: rock.dY + random(-1, 1),
      size: newSize,
      id: rock.id + 100,
    });
    hostData.rocks.push({
      x: rock.x,
      y: rock.y,
      dX: rock.dX + random(-1, 1),
      dY: rock.dY + random(-1, 1),
      size: newSize,
      id: rock.id + 200,
    });
  }
  hostData.rocks = hostData.rocks.filter((rock) => rock.id !== rockId);
}

function drawRock(rock) {
  push();
  translate(rock.x, rock.y);
  noFill();
  stroke("white");
  ellipse(0, 0, rock.size);
  pop();
}
