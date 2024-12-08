// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://unpkg.com/@timohausmann/quadtree-js/quadtree.min.js
/* global Quadtree */
/**
 *  spring_03_force_directed_graph
 *
 */
const kDRAG = 0.01;
const kG = { x: 0, y: 0.0 };
const kRESTITUTION = 0.9;
const kFRICTION = 0.1;
const STEPS = 1;
const METHOD = "HALF"; // EULER, HALF

const particles = [];
const springs = [];

let debugInfo;

console.log("quadtree", Quadtree);

function setup() {
  createCanvas(720, 480);

  // make particles at corners of a square
  const size = 30;
  const root = new Particle({ x: 360, y: 340 });
  particles.push(root);

  sprout(root, 6, 100);

  debugInfo = createDiv();
}

function sprout(root, count, length) {
  if (count === 0) return;
  times(count, () => {
    const r = randomNormalVector();
    const p = new Particle({
      x: root.position.x + r.x * length,
      y: root.position.y + r.y * length,
    });
    particles.push(p);
    springs.push(new Spring(root, p));
    sprout(p, count - 1, length * 0.75);
  });
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

    if (METHOD === "EULER") {
      // Semi-implicit Euler integration
      // apply forces
      this.velocity.x += (this.forces.x / this.mass) * t;
      this.velocity.y += (this.forces.y / this.mass) * t;

      // momentum
      this.position.x += this.velocity.x * t;
      this.position.y += this.velocity.y * t;
    }

    if (METHOD === "HALF") {
      // this is the half step velocity
      // same as verlet, but i like the readability of this better

      // apply half the acceleration
      this.velocity.x += 0.5 * (this.forces.x / this.mass) * t;
      this.velocity.y += 0.5 * (this.forces.y / this.mass) * t;

      // move
      this.position.x += this.velocity.x * t;
      this.position.y += this.velocity.y * t;

      // apply half the acceleration
      this.velocity.x += 0.5 * (this.forces.x / this.mass) * t;
      this.velocity.y += 0.5 * (this.forces.y / this.mass) * t;
    }

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
  times(STEPS, () => step(1 / STEPS));
  render();
}

function step(t = 1) {
  relax(particles, 30, 0.1);

  for (const s of springs) {
    s.step(t);
  }

  for (const p of particles) {
    p.step(t);
  }
}

function relax(particles, radius = 100, k = 0.01) {
  const startTime = performance.now();

  const tree = new Quadtree({ x: 0, y: 0, width: 720, height: 480 });

  particles.forEach((p) => {
    tree.insert({ x: p.position.x, y: p.position.y, width: 0, height: 0, p });
  });

  for (const a of particles) {
    const nearBy = tree.retrieve({
      x: a.position.x - radius,
      y: a.position.y - radius,
      width: radius * 2,
      height: radius * 2,
    });

    for (const bPtr of nearBy) {
      const b = bPtr.p;
      if (a === b) continue;
      const dP = {
        x: b.position.x - a.position.x,
        y: b.position.y - a.position.y,
      };

      const nP = normalize(dP);
      const mP = magnitude(dP);
      if (mP > radius) continue;
      const relaxForce = ((mP - radius) / radius) * k;

      a.forces.x += nP.x * relaxForce;
      a.forces.y += nP.y * relaxForce;
      b.forces.x += nP.x * -relaxForce;
      b.forces.y += nP.y * -relaxForce;
    }
  }

  const endTime = performance.now();
  debugInfo.html(`relax time: ${(endTime - startTime).toFixed(2)}ms`);
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
function randomNormalVector() {
  const angle = random(TWO_PI);
  return { x: cos(angle), y: sin(angle) };
}
/// Helper functions
function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
