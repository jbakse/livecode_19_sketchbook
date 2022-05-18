// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const sprites = [];

function setup() {
  createCanvas(960, 540);
  for (const _ of range(10)) {
    console.log(_);
    sprites.push(new Mass(random(width), random(height)));
  }
  sprites.push(new Spring(sprites[0], sprites[1]));
  sprites.push(new Spring(sprites[0], sprites[2]));
  sprites.push(new Spring(sprites[0], sprites[3]));
  sprites.push(new Spring(sprites[0], sprites[4]));
}

function draw() {
  background("black");

  noFill();
  strokeWeight(1);
  stroke("white");
  for (const sprite of sprites) {
    sprite.draw();
  }
}

class Mass {
  constructor(x, y, mass = 1) {
    this.x = x;
    this.y = y;

    this.mass = mass;
  }

  draw() {
    ellipse(this.x, this.y, 10, 10);
  }
}

class Spring {
  constructor(mass1, mass2, length, k = 0.1) {
    this.mass1 = mass1;
    this.mass2 = mass2;
    this.length = length ?? dist(mass1.x, mass1.y, mass2.x, mass2.y);
    this.k = k;
  }
  draw() {
    push();
    strokeWeight(1);

    line(this.mass1.x, this.mass1.y, this.mass2.x, this.mass2.y);

    const d = dist(this.mass1.x, this.mass1.y, this.mass2.x, this.mass2.y);
    const x = (this.mass1.x - this.mass2.x) / d;
    const y = (this.mass1.y - this.mass2.y) / d;
    const centerX = (this.mass1.x + this.mass2.x) / 2;
    const centerY = (this.mass1.y + this.mass2.y) / 2;

    stroke("red");
    translate(y * 5, -x * 5);
    line(
      centerX - x * d * 0.5,
      centerY - y * d * 0.5,
      centerX + x * d * 0.5,
      centerY + y * d * 0.5
    );

    pop();
  }
}

function range(start, stop, step) {
  if (typeof stop === "undefined") {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step === "undefined") {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  const result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}
