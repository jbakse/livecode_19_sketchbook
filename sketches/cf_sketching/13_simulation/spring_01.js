// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const kDRAG = 0.001;
const kG = { x: 0, y: 0.1 };
const kRESTITUTION = 0.9;
const kFRICTION = 0.1;

const particles = [];
const springs = [];

function setup() {
  createCanvas(720, 480);

  // make particles at corners of a square
  const size = 30;
  const tl = new Particle({ x: 360 - size, y: 240 - size }, { x: 0, y: -40 });
  const tr = new Particle({ x: 360 + size, y: 240 - size });
  const br = new Particle({ x: 360 + size, y: 240 + size });
  const bl = new Particle({ x: 360 - size, y: 240 + size });
  particles.push(tl, tr, br, bl);

  // connect the edges and a diagonal
  springs.push(
    new Spring(tl, tr),
    new Spring(tr, br),
    new Spring(br, bl),
    new Spring(bl, tl),
    new Spring(tl, br),
    new Spring(tr, bl)
  );
}

class Particle {
  constructor(position, velocity) {
    this.position = position ?? { x: 0, y: 0 };
    this.velocity = velocity ?? { x: 0, y: 0 };
  }

  step(t) {
    // gravity
    this.velocity.x += kG.x * t;
    this.velocity.y += kG.y * t;

    // momentum
    this.position.x += this.velocity.x * t;
    this.position.y += this.velocity.y * t;

    // drag
    const dragVector = normalize({
      x: -this.velocity.x,
      y: -this.velocity.y,
    });
    const dragMagnitude =
      magnitude(this.velocity) * magnitude(this.velocity) * kDRAG;
    this.velocity.x += dragVector.x * dragMagnitude * t;
    this.velocity.y += dragVector.y * dragMagnitude * t;

    // bottom collision - kinda hacky
    if (this.position.y > height) {
      this.position.y = height;
      this.velocity.y = -abs(this.velocity.y) * kRESTITUTION;

      // this _should_ take into account t, but its a quick hack
      this.velocity.x *= kFRICTION;
    }
  }
}

class Spring {
  constructor(a, b, length, k) {
    this.a = a;
    this.b = b;
    this.length =
      length ?? dist(a.position.x, a.position.y, b.position.x, b.position.y);
    this.k = k ?? 0.1;
    this.damp = 0.1;
  }

  step(t) {
    const dP = {
      x: this.b.position.x - this.a.position.x,
      y: this.b.position.y - this.a.position.y,
    };
    const nP = normalize(dP);
    const mP = magnitude(dP);

    const dV = {
      x: this.b.velocity.x - this.a.velocity.x,
      y: this.b.velocity.y - this.a.velocity.y,
    };

    const springForce = (mP - this.length) * this.k;
    const dampenForce = (dot(dV, dP) / mP) * this.damp;

    const force = springForce + dampenForce;

    this.a.velocity.x += nP.x * force * t;
    this.a.velocity.y += nP.y * force * t;
    this.b.velocity.x += nP.x * -force * t;
    this.b.velocity.y += nP.y * -force * t;
  }
}

function draw() {
  const STEPS = 1;
  times(STEPS, () => step(1 / STEPS));
  render();
}

function step(t = 1) {
  for (const s of springs) {
    s.step(t);
  }

  for (const p of particles) {
    p.step(t);
  }
}

function render() {
  background("black");

  noFill();
  stroke("white");
  strokeWeight(1);
  for (const p of particles) {
    ellipse(p.position.x, p.position.y, 4, 4);
  }

  for (const s of springs) {
    line(s.a.position.x, s.a.position.y, s.b.position.x, s.b.position.y);
  }
}

/// Vector 2D
function normalize(v) {
  const m = magnitude(v);
  return { x: v.x / m, y: v.y / m };
}

function magnitude(v) {
  return dist(0, 0, v.x, v.y);
}

function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

/// Helper functions
function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
