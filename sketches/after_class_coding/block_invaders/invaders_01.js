console.log("Hello, Block Invaders!!");

// setup canvas

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.id = "block-invaders";
canvas.width = 480;
canvas.height = 640;
document.body.appendChild(canvas);

// set up keyboard

const controls = {
  left: false,
  right: false,
  fire: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") controls.left = true;
  if (e.key === "ArrowRight") controls.right = true;
  if (e.key === "a") controls.left = true;
  if (e.key === "d") controls.right = true;
  if (e.key === " ") controls.fire = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") controls.left = false;
  if (e.key === "ArrowRight") controls.right = false;
  if (e.key === "a") controls.left = false;
  if (e.key === "d") controls.right = false;
  if (e.key === " ") controls.fire = false;
});

// game state

let ship;
let bullets = [];
let enemies = [];

function setup() {
  ship = new Ship();

  spawnLevel();
}

let waitingForLevelSpawn = false;

function step() {
  ship.step();
  for (let bullet of bullets) {
    bullet.step();
  }
  for (let bullet of bullets) {
    bullet.collisions();
  }
  for (let enemy of enemies) {
    enemy.step();
  }
  for (let enemy of enemies) {
    enemy.collisions();
  }

  if (enemies.length === 0) {
    if (!waitingForLevelSpawn) {
      setTimeout(spawnLevel, 2000);
      waitingForLevelSpawn = true;
    }
  }
}

function spawnLevel() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      enemies.push(new Enemy(col * 30, row * 30 + 50));
    }
  }
  waitingForLevelSpawn = false;
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ship.draw();
  for (let bullet of bullets) {
    bullet.draw();
  }
  for (let enemy of enemies) {
    enemy.draw();
  }
}

function onFrame(t) {
  step();
  draw();

  window.requestAnimationFrame(onFrame);
}

class Ship {
  constructor() {
    this.x = canvas.width * 0.5;
    this.y = canvas.height - 100;
    this.w = 50;
    this.h = 80;
    this.cooldown = 0;
  }

  step() {
    if (controls.left) this.x -= 10;
    if (controls.right) this.x += 10;
    if (controls.fire) this.fire();
    if (this.cooldown > 0) this.cooldown--;
  }

  remove() {
    console.log("ouch");
  }
  fire() {
    if (this.cooldown === 0) {
      bullets.push(new Bullet(this.x, this.y, -20));
      this.cooldown = 1;
    }
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
  }
}

class Bullet {
  constructor(x, y, dY = -10, targets = enemies) {
    this.x = x;
    this.y = y;
    this.dY = dY;
    this.targets = targets;
    this.w = 5;
    this.h = 10;
  }

  step() {
    this.y += this.dY;
  }

  collisions() {
    for (let target of this.targets) {
      if (pointRectCollision(this, target)) {
        target.remove();
        this.remove();
      }
    }

    if (this.y < -20) this.remove();
  }

  remove() {
    const index = bullets.indexOf(this);
    if (index > -1) {
      bullets.splice(index, 1);
    }
  }
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 25;
    this.h = 25;
    this.dX = 3;
  }

  step() {
    this.x += this.dX;

    if (Math.random() < 0.0002) {
      this.fire();
    }
  }

  fire() {
    // if (this.cooldown === 0) {
    bullets.push(new Bullet(this.x, this.y, 5, [ship]));
    //  this.cooldown = 10;
    // }
  }

  collisions() {
    if (this.x > canvas.width) {
      for (let enemy of enemies) {
        enemy.dX = -Math.abs(this.dX);
      }
    }
    if (this.x < 0) {
      for (let enemy of enemies) {
        enemy.dX = Math.abs(this.dX);
      }
    }
  }

  remove() {
    const index = enemies.indexOf(this);
    if (index > -1) {
      enemies.splice(index, 1);
    }
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
  }
}

function pointRectCollision(p, r) {
  return (
    p.x > r.x - r.w * 0.5 &&
    p.x < r.x + r.w * 0.5 &&
    p.y > r.y - r.h * 0.5 &&
    p.y < r.y + r.h * 0.5
  );
}

// run setup once
setup();

// kick off animation
window.requestAnimationFrame(onFrame);
