import { gameStates, setGameState } from "./main.js";
import { config } from "./main.js";
import {
  explodeParticles,
  updateParticles,
  drawParticles,
} from "./particles.js";
/* globals loadSound */

/* global partyConnect partyLoadShared partyLoadMyShared partyLoadGuestShareds*/
/* global partySetShared */
/* global partyIsHost partyToggleInfo */
/* global partyEmit partySubscribe partyUnsubscribe */

const sounds = {};
let hostData, me, guests;

export function preload() {
  //   sounds.rock1 = loadSound("./sounds/rock1.wav");
  //   sounds.rock2 = loadSound("./sounds/rock2.wav");
  sounds.rock4 = loadSound("./sounds/rock4.wav");
  sounds.thrust = loadSound("./sounds/thrust.wav");
  sounds.shoot = loadSound("./sounds/shoot.wav");
  sounds.spawn = loadSound("./sounds/spawn.wav");
  sounds.die = loadSound("./sounds/die.wav");
  sounds.music = loadSound("./sounds/music.wav");

  partyConnect("wss://deepstream-server-1.herokuapp.com", "rocks", "main");

  hostData = partyLoadShared("host", { rocks: initRocks() });
  me = partyLoadMyShared(initShip());
  guests = partyLoadGuestShareds({});
}
export function enter() {
  partySubscribe("rockHit", onRockHit);
  partyToggleInfo(true);

  spawn();
  // sounds.music.loop(0, 1, 0.5);
}

export function update() {
  // todo: factor out all the host stuff
  if (partyIsHost()) {
    updateRocks();
  }

  handleInput(me);
  updateShip(me);

  updateParticles();
}

export function draw() {
  push();
  background("black");
  modDraw(drawWorld);
  pop();
}

function drawWorld() {
  for (const guest of guests) {
    drawShip(guest);
  }

  for (const rock of hostData.rocks) {
    drawRock(rock);
  }

  drawParticles();
}

export function mousePressed() {
  setGameState(gameStates.title);
}

export function keyPressed() {
  if (keyCode === 32 /* Space */) fire();

  // todo: this could probably be better cleaned up
  if (me.alive && (keyCode === UP_ARROW || keyCode === 87) /* W */)
    sounds.thrust.loop(0, 1, 0.5);
}

export function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === 87 /* W */) sounds.thrust.stop();
}

export function leave() {
  partyUnsubscribe("rockHit", onRockHit);
  partyToggleInfo(false);

  sounds.music.stop();
}

// //////////////////////////////////////////////////////
// INPUT

function handleInput(ship) {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65) /* A */) turnShip(ship, -0.05);
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) /* D */) turnShip(ship, 0.05);
  if (keyIsDown(UP_ARROW) || keyIsDown(87) /* W */) thrustShip(ship, 0.1);
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83) /* S */) thrustShip(ship, -0.1);
  ship.thrusting = keyIsDown(UP_ARROW) || keyIsDown(87);
  ship.reversing = keyIsDown(DOWN_ARROW) || keyIsDown(83);
}

// //////////////////////////////////////////////////////
// SHIPs

function spawn() {
  partySetShared(me, initShip());
  sounds.spawn.play();
}

function die() {
  me.alive = false;
  explodeParticles(50, me.x, me.y, me.dX, me.dY, 2, 100);

  sounds.thrust.stop();
  sounds.die.play();
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

function initShip() {
  const ship = {};
  ship.alive = true;
  ship.x = config.width * 0.5;
  ship.y = config.height * 0.5;
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
  if (ship.x > config.width) ship.x = 0;
  if (ship.x < 0) ship.x = config.width;
  if (ship.y > config.height) ship.y = 0;
  if (ship.y < 0) ship.y = config.height;

  for (const rock of hostData.rocks) {
    if (dist(ship.x, ship.y, rock.x, rock.y) < rock.size * 0.5) {
      partyEmit("rockHit", rock.id);
      die();
      setTimeout(() => {
        spawn();
      }, 3000);
    }
  }

  for (const bullet of ship.bullets) {
    updateBullet(bullet);
  }
  ship.bullets = ship.bullets.filter((bullet) => bullet.age < 100);
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
  if (ship.thrusting) {
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

  if (ship.reversing) {
    push();
    fill("#f00");
    translate(ship.x, ship.y);
    rotate(ship.angle);
    rect(-12, -6, 2, 4);
    rect(-12, 6, 2, -4);
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
  if (bullet.x > config.width) bullet.x = 0;
  if (bullet.x < 0) bullet.x = config.width;
  if (bullet.y > config.height) bullet.y = 0;
  if (bullet.y < 0) bullet.y = config.height;

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

// //////////////////////////////////////////////////////
// ROCKS

function initRocks() {
  const rocks = [];
  for (let i = 0; i < 10; i++) {
    rocks.push(initRock());
  }
  console.log(rocks);
  return rocks;
}

function initRock(overrides = {}) {
  let x = random(0, config.width);
  const y = random(0, config.height);
  if (dist(x, y, config.width * 0.5, config.height * 0.5) < 100) {
    x = 0;
  }
  return {
    x,
    y,
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
  if (rock.x > config.width) rock.x = 0;
  if (rock.x < 0) rock.x = config.width;
  if (rock.y > config.height) rock.y = 0;
  if (rock.y < 0) rock.y = config.height;
}

function onRockHit(rockId) {
  // find the rock
  const rock = hostData.rocks.find((rock) => rock.id === rockId);
  if (!rock) return;

  // stuff everyone does
  sounds.rock4.play();

  explodeParticles(rock.size * 0.25, rock.x, rock.y, rock.dX, rock.dY);

  // stuff just host does
  if (!partyIsHost()) return;

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
  //   modDraw(() => {
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
  //   });

  pop();
}

function modDraw(f) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      push();
      translate(x * config.width, y * config.height);
      f?.();
      pop();
    }
  }
}
