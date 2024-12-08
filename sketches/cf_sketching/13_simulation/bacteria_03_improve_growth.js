// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require module /sketches/grabber/out.js
// require https://unpkg.com/@timohausmann/quadtree-js/quadtree.min.js
/* global Quadtree */

/**
 *
 */
const kDRAG = 0.1;
const kG = { x: 0.0, y: 0.0 };
const kRESTITUTION = 0.9;
const kFRICTION = 0.1;
const STEPS = 4;
const METHOD = "EULER"; // EULER, HALF

const particles = [];
const springs = [];

const bacteria = [];

class Bacterium {
  constructor(aPos, bPos) {
    this.a = new Particle({ ...aPos });
    this.b = new Particle({ ...bPos });
    particles.push(this.a, this.b);
    this.spring = new Spring(this.a, this.b);
    springs.push(this.spring);

    this.isAlive = true;
  }

  step(t) {
    if (!this.isAlive) return;
    if (this.a.radius < 4) this.a.radius += 0.05 * t;
    if (this.b.radius < 4) this.b.radius += 0.05 * t;

    if (this.spring.length < 10) {
      this.spring.length += 0.05 * t;
    } else {
      splitBacterium(this);
    }
  }

  kill() {
    this.isAlive = false;
    particles.splice(particles.indexOf(this.a), 1);
    particles.splice(particles.indexOf(this.b), 1);
    springs.splice(springs.indexOf(this.spring), 1);
  }
}

function splitBacterium(old) {
  if (particles.length > 1000) return;

  const newA = new Bacterium(
    { x: old.a.position.x, y: old.a.position.y },
    {
      x: lerp(old.a.position.x, old.b.position.x, 0.4) + random(-0.5, 0.5),
      y: lerp(old.a.position.y, old.b.position.y, 0.4) + random(-0.5, 0.5),
    }
  );

  newA.a.velocity.x = old.a.velocity.x;
  newA.a.velocity.y = old.a.velocity.y;
  newA.b.velocity.x = lerp(old.a.velocity.x, old.b.velocity.x, 0.4);
  newA.b.velocity.y = lerp(old.a.velocity.y, old.b.velocity.y, 0.4);
  newA.b.radius = 0;

  const newB = new Bacterium(
    {
      x: lerp(old.a.position.x, old.b.position.x, 0.6) + random(-0.5, 0.5),
      y: lerp(old.a.position.y, old.b.position.y, 0.6) + random(-0.5, 0.5),
    },
    { x: old.b.position.x, y: old.b.position.y }
  );

  newB.a.radius = 0;
  newB.a.velocity.x = lerp(old.a.velocity.x, old.b.velocity.x, 0.6);
  newB.a.velocity.y = lerp(old.a.velocity.y, old.b.velocity.y, 0.6);
  newB.b.velocity.x = old.b.velocity.x;
  newB.b.velocity.y = old.b.velocity.y;

  bacteria.push(newA, newB);

  old.kill();
}

function setup() {
  createCanvas(720, 480);
  bacteria.push(new Bacterium({ x: 360, y: 240 }, { x: 360, y: 240 + 5 }));
  // bacteria.push(new Bacterium({ x: 370, y: 240 }, { x: 370, y: 240 + 5 }));
  // bacteria.push(new Bacterium({ x: 380, y: 240 }, { x: 380, y: 240 + 5 }));
  frameRate(30);
}

function draw() {
  times(STEPS * 2, () => step(1 / STEPS));
  render();

  if (particles.length > 1024) noLoop();
}

function mousePressed() {
  isLooping() ? noLoop() : loop();
}

function step(t = 1) {
  for (const b of bacteria) {
    b.step(t);
  }

  filterInPlace(bacteria, (b) => b.isAlive);

  relax(particles, 10, 10);
  gravityToward(particles, { x: 360, y: 240 }, 0.001);

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
    ellipse(p.position.x, p.position.y, p.radius * 2, p.radius * 2);
  }

  for (const s of springs) {
    line(s.a.position.x, s.a.position.y, s.b.position.x, s.b.position.y);
  }
}

const tree = new Quadtree({ x: 0, y: 0, width: 720, height: 480 });

function relax(particles, searchRadius = 100, k = 0.01) {
  const startTime = performance.now();

  tree.clear();
  particles.forEach((p) => {
    tree.insert({ x: p.position.x, y: p.position.y, width: 0, height: 0, p });
  });

  for (const a of particles) {
    const nearBy = tree.retrieve({
      x: a.position.x - searchRadius,
      y: a.position.y - searchRadius,
      width: searchRadius * 2,
      height: searchRadius * 2,
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

      const effectRadius = a.radius + b.radius;
      if (mP > effectRadius) continue;
      const relaxForce = ((mP - effectRadius) / effectRadius) * k;

      a.forces.x += nP.x * relaxForce;
      a.forces.y += nP.y * relaxForce;
      b.forces.x += nP.x * -relaxForce;
      b.forces.y += nP.y * -relaxForce;
    }
  }

  const endTime = performance.now();
  // debugInfo.html(`relax time: ${(endTime - startTime).toFixed(2)}ms`);
}

function gravityToward(particles, target, k = 0.01) {
  for (const p of particles) {
    const dP = {
      x: target.x - p.position.x,
      y: target.y - p.position.y,
    };

    const nP = normalize(dP);
    const mP = magnitude(dP);

    const force = mP * k;

    p.forces.x += nP.x * force;
    p.forces.y += nP.y * force;
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

function filterInPlace(array, predicate) {
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    if (predicate(array[readIndex], readIndex, array)) {
      array[writeIndex++] = array[readIndex];
    }
  }

  array.length = writeIndex; // Trim the array to the new size
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
    this.radius = 4;
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
    this.k = k ?? 0.5;
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
