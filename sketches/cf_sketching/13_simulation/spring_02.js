// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/**
 * spring_02
 * Additions:
 * - particles have mass
 * - particles have a force accumulator, springs add to this instead of directly modifying velocity
 * - fix divide by zero error in normalize()
 */
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

// Vector2DDebug class is currently just a debuging tool
// it throws if you try to set x or y to NaN
// helping you identify where NaN values are coming from
class Vector2DDebug {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    if (isNaN(value)) {
      throw new Error("x value cannot be NaN");
    }
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    if (isNaN(value)) {
      throw new Error("y value cannot be NaN");
    }
    this._y = value;
  }
}

class Particle {
  constructor(position, velocity, mass) {
    this.position = new Vector2DDebug(position ?? { x: 0, y: 0 });
    this.velocity = new Vector2DDebug(velocity ?? { x: 0, y: 0 });
    this.mass = mass ?? 1;

    this.forces = new Vector2DDebug({ x: 0, y: 0 });
  }

  step(t) {
    // gravity
    this.forces.x += this.mass * kG.x;
    this.forces.y += this.mass * kG.y;

    // drag
    const dragVector = normalize({
      x: -this.velocity.x,
      y: -this.velocity.y,
    });
    const dragMagnitude =
      magnitude(this.velocity) * magnitude(this.velocity) * kDRAG;
    this.forces.x += dragVector.x * dragMagnitude;
    this.forces.y += dragVector.y * dragMagnitude;

    // apply forces
    this.velocity.x += this.forces.x * t;
    this.velocity.y += this.forces.y * t;

    // momentum
    this.position.x += this.velocity.x * t;
    this.position.y += this.velocity.y * t;

    this.forces.x = 0;
    this.forces.y = 0;

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

    this.a.forces.x += nP.x * force;
    this.a.forces.y += nP.y * force;
    this.b.forces.x += nP.x * -force;
    this.b.forces.y += nP.y * -force;
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
  if (m === 0) return { x: 0, y: 0 };
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
