// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// - if you are not carrying anything and you
//   bump into a wood chip, pick it up.
// - if you are carrying a wood chip and you pump
//   into another wood chip, put down the wood chip
//   you are carrying.

class Termite {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.turnTo(random(2 * PI));
    this.senseCooldown = 0;
  }

  turnTo(a) {
    this.dX = sin(a) * 2;
    this.dY = cos(a) * 2;
  }

  step() {
    this.move();
    if (this.senseCooldown-- < 0) this.sense();
  }

  move() {
    this.x += this.dX;
    this.y += this.dY;

    if (this.heldSprite) {
      this.heldSprite.x = this.x;
      this.heldSprite.y = this.y;
    }

    if (this.x > width) this.dX = -abs(this.dX);
    if (this.y > height) this.dY = -abs(this.dY);
    if (this.x < 0) this.dX = abs(this.dX);
    if (this.y < 0) this.dY = abs(this.dY);
  }

  sense() {
    for (const w of woodchips) {
      if (w === this.heldSprite) continue;

      if (compareDist(this.x, this.y, w.x, w.y, 3)) {
        if (this.heldSprite) {
          this.heldSprite = null;
          //   this.turnTo(random(2 * PI));
          this.senseCooldown = 20;
          break;
        } else {
          this.heldSprite = w;
          break;
        }
      }
    }
  }

  draw() {
    push();
    noStroke();
    fill(this.senseCooldown > 0 ? 100 : 255, 0, 0);
    ellipse(this.x, this.y, 10, 10);
    pop();
  }
}

class Woodchip {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  step() {
    // noop
  }
  draw() {
    push();
    noStroke();
    fill(0, 255, 0);
    triangle(this.x, this.y, this.x + 5, this.y + 8, this.x + 10, this.y);
    pop();
  }
}

let termites = [];
let woodchips = [];
let sprites = [];

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  for (let i = 0; i < 50; i++) {
    const t = new Termite(random(width), random(height));
    termites.push(t);
    sprites.push(t);
  }

  for (let i = 0; i < 250; i++) {
    const w = new Woodchip(random(width), random(40, height));
    woodchips.push(w);
    sprites.push(w);
  }
}

function draw() {
  const steps = mouseIsPressed ? mouseX : 1;
  times(steps, stepApp);
  drawApp();
  drawUI();
}

function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

function stepApp() {
  for (const s of sprites) {
    s.step();
  }
}

function drawApp() {
  background(10);
  for (const s of sprites) {
    s.draw();
  }
}

function drawUI() {
  fill(255);
  noStroke();
  text("termites — mousedown to fast forward", 10, 20);
  if (mouseIsPressed) text(mouseX + "x", mouseX, 40);
}

function compareDist(x1, y1, x2, y2, n) {
  if (abs(x1 - x2) > n) return false;
  if (abs(y1 - y2) > n) return false;
  return dist(x1, y1, x2, y2) < n;
}
