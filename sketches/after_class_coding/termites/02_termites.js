// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

class Termite {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    const a = random(2 * PI);
    this.dX = sin(a) * 2;
    this.dY = cos(a) * 2;
  }

  step() {
    this.x += this.dX;
    this.y += this.dY;

    if (this.x > width) this.dX = -abs(this.dX);
    if (this.y > height) this.dY = -abs(this.dY);
    if (this.x < 0) this.dX = abs(this.dX);
    if (this.y < 0) this.dY = abs(this.dY);
  }

  draw() {
    push();
    noStroke();
    fill(255, 0, 0);
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
    const w = new Woodchip(random(width), random(height));
    woodchips.push(w);
    sprites.push(w);
  }
}

function draw() {
  stepApp();
  drawApp();
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
