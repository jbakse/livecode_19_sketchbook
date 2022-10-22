// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/addons/p5.sound.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload mousePressed keyPressed keyReleased keyTyped */
/* global partyConnect partyIsHost partyLoadShared partyLoadMyShared partyLoadGuestShareds partySetShared partyEmit partySubscribe partyToggleInfo*/
/* global loadSound */
/* global sketch_directory */

const WIDTH = 800;
const HEIGHT = 800;

let me, guests;
let hostData;

const sounds = {};

function preload() {
  sounds.rock1 = loadSound(`${sketch_directory}/sounds/rock1.wav`);
  sounds.rock2 = loadSound(`${sketch_directory}/sounds/rock2.wav`);
  sounds.rock3 = loadSound(`${sketch_directory}/sounds/rock3.wav`);
  sounds.thrust = loadSound(`${sketch_directory}/sounds/thrust.wav`);
  sounds.shoot = loadSound(`${sketch_directory}/sounds/shoot.wav`);
  sounds.spawn = loadSound(`${sketch_directory}/sounds/spawn.wav`);
  sounds.music = loadSound(`${sketch_directory}/sounds/music.wav`);

  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "jb_asteroids_06",
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

  preventDefaultKeys();
  sounds.music.loop();
  sounds.spawn.play();
}

function draw() {
  // update
  if (partyIsHost()) {
    updateRocks();
  }

  handleInput(me);
  updateShip(me);

  // draw
  background("black");

  for (const guest of guests) {
    drawShip(guest);
  }

  for (const rock of hostData.rocks) {
    drawRock(rock);
  }
}

function keyPressed() {
  if (keyCode === 32 /* Space */) fire();
  if (keyCode === UP_ARROW || keyCode === 87 /* W */)
    sounds.thrust.loop(0, 1, 0.5);
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === 87 /* W */) sounds.thrust.stop();
}

function handleInput(ship) {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65) /* A */) turnShip(ship, -0.05);
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) /* D */) turnShip(ship, 0.05);
  if (keyIsDown(UP_ARROW) || keyIsDown(87) /* W */) thrustShip(ship, 0.1);
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83) /* S */) thrustShip(ship, -0.1);
}

function fire() {
  if (!me.alive) return;
  sounds.shoot.play();
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
        sounds.spawn.play();
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
  fill("white");
  noStroke();
  translate(ship.x, ship.y);
  rotate(ship.angle);
  triangle(-10, -10, 15, 0, -10, 10);
  pop();

  // draw thrust
  if (keyIsDown(UP_ARROW) || keyIsDown(87) /* W */) {
    push();
    stroke("white");
    noFill();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    const offset1 = (frameCount * 0.6 + 0) % 10;
    const size1 = map(offset1, 0, 10, 8, 0);
    line(-10 - offset1, -size1, -10 - offset1, size1);
    const offset2 = (frameCount * 0.6 + 5) % 10;
    const size2 = map(offset2, 0, 10, 8, 0);
    line(-10 - offset2, -size2, -10 - offset2, size2);
    pop();
  }

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
    rocks.push(initRock());
  }
  return rocks;
}

function initRock(overrides = {}) {
  return {
    x: random(0, WIDTH),
    y: random(0, HEIGHT),
    r: 0,
    dX: random(-1, 1),
    dY: random(-1, 1),
    dR: random(-0.01, 0.0),
    size: random([16, 32, 64]),
    id: random(), // random id, easy to use, unlikely to collide
    ...overrides,
  };
}

function updateRocks() {
  for (const rock of hostData.rocks) {
    updateRock(rock);
  }
}

function updateRock(rock) {
  rock.x += rock.dX;
  rock.y += rock.dY;
  rock.r += rock.dR;
  if (rock.x > width) rock.x = 0;
  if (rock.x < 0) rock.x = width;
  if (rock.y > height) rock.y = 0;
  if (rock.y < 0) rock.y = height;
}

function onRockHit(rockId) {
  // random all the things...
  // random sample
  random([sounds.rock1, sounds.rock2, sounds.rock3]).play(
    0
    // random(0.9, 1.1), // random speed
    // random(0.5, 1) // random volume
  );

  if (!partyIsHost()) return;

  // find the rock
  const rock = hostData.rocks.find((rock) => rock.id === rockId);
  if (!rock) return;

  // spawn new rocks
  if (rock.size > 16) {
    const newSize = rock.size / 2;
    hostData.rocks.push(
      initRock({
        size: newSize,
        x: rock.x,
        y: rock.y,
        dX: rock.dX + random(-1, 1),
        dY: rock.dY + random(-1, 1),
      })
    );
    hostData.rocks.push(
      initRock({
        size: newSize,
        x: rock.x,
        y: rock.y,
        dX: rock.dX + random(-1, 1),
        dY: rock.dY + random(-1, 1),
      })
    );
  }

  // remove the rock
  hostData.rocks = hostData.rocks.filter((rock) => rock.id !== rockId);
}

function drawRock(rock) {
  push();
  noFill();
  stroke("white");
  strokeWeight(2);
  translate(rock.x, rock.y);
  rotate(rock.r);
  const steps = 10;
  beginShape();
  for (let step = 0; step < steps; step++) {
    const a1 = map(step - 1, 0, steps, 0, 2 * PI);
    const n = map(noise(rock.id, step), 0, 1, 0.5, 1.5);
    const x1 = sin(a1) * rock.size * 0.5 * n;
    const y1 = cos(a1) * rock.size * 0.5 * n;
    vertex(x1, y1);
  }
  endShape(CLOSE);

  pop();
}

function preventDefaultKeys() {
  // prevent browser from handling simple key presses
  // allow "meta" keys through
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.ctrlKey || e.metaKey) {
      return true;
    }
    e.preventDefault();
    return false;
  });
}
