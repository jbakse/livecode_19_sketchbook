// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require module /sketches/grabber/out.js
// require https://unpkg.com/@timohausmann/quadtree-js/quadtree.min.js
/* global Quadtree */

/**
 * Simulation of exponential growth of bacteria.
 * Inspired by:
 * https://en.wikipedia.org/wiki/Exponential_growth?useskin=vector#/media/File:E.coli-colony-growth.gif
 *
 *
 */

/// settings
const DRAW_DEBUG = false;
const DRAW_RENDER = true;
const FRAMERATE = 60;

/// physics constants
const kDRAG = 0.2;
const kG = { x: 0.0, y: 0.0 };
const kRESTITUTION = 0.9;
const kFRICTION = 0.1;
const STEPS = 4;
const METHOD = "EULER"; // EULER, HALF

/// state
const particles = [];
const springs = [];
const bacteria = [];

/// dom + debug
let debugInfo;
const timings = {
  render: 0,
  grain: 0,
  blur: 0,
  simulation: 0,
  collisions: 0,
  rSum: 0,
  r: 0,
};
const timingsLowPass = {};

class Bacterium {
  constructor(aPos, bPos) {
    this.a = new Particle({ ...aPos });
    this.b = new Particle({ ...bPos });
    particles.push(this.a, this.b);

    this.spring = new Spring(this.a, this.b);
    springs.push(this.spring);

    this.isAlive = true;
    this.growSpeed = random(0.9, 1.1);
  }

  step(t) {
    if (!this.isAlive) return;

    // grow the split ends
    if (this.a.radius < 4) this.a.radius += 0.05 * t;
    if (this.b.radius < 4) this.b.radius += 0.05 * t;

    // grow the spring
    if (this.spring.length < 10) {
      this.spring.length += 0.07 * t * this.growSpeed;
    } else {
      this.split();
    }
  }

  kill() {
    this.isAlive = false;

    // remove components from physics
    particles.splice(particles.indexOf(this.a), 1);
    particles.splice(particles.indexOf(this.b), 1);
    springs.splice(springs.indexOf(this.spring), 1);
  }

  split() {
    // upper limit of particles
    if (particles.length > 4096) return;

    // split    this.a |=========================| this.b
    // into        A.a |=======| A.b  B.a |======|    B.b

    // create "A" half
    const newA = new Bacterium(
      { x: this.a.position.x, y: this.a.position.y },
      {
        x: lerp(this.a.position.x, this.b.position.x, 0.4),
        y: lerp(this.a.position.y, this.b.position.y, 0.4),
      }
    );

    newA.a.velocity.x = this.a.velocity.x;
    newA.a.velocity.y = this.a.velocity.y;
    newA.b.velocity.x = lerp(this.a.velocity.x, this.b.velocity.x, 0.4);
    newA.b.velocity.y = lerp(this.a.velocity.y, this.b.velocity.y, 0.4);
    newA.b.radius = 0;

    // create "B" half
    const newB = new Bacterium(
      {
        x: lerp(this.a.position.x, this.b.position.x, 0.6) + random(-0.5, 0.5),
        y: lerp(this.a.position.y, this.b.position.y, 0.6) + random(-0.5, 0.5),
      },
      { x: this.b.position.x, y: this.b.position.y }
    );

    newB.a.radius = 0;
    newB.a.velocity.x = lerp(this.a.velocity.x, this.b.velocity.x, 0.6);
    newB.a.velocity.y = lerp(this.a.velocity.y, this.b.velocity.y, 0.6);
    newB.b.velocity.x = this.b.velocity.x;
    newB.b.velocity.y = this.b.velocity.y;

    // add to bacteria simulation
    bacteria.push(newA, newB);

    // this one dies
    this.kill();
  }
}

function setup() {
  // setup p5
  pixelDensity(1);
  createCanvas(720, 480);
  frameRate(FRAMERATE);

  // setup dom
  debugInfo = createDiv();

  // setup sim
  bacteria.push(new Bacterium({ x: 360, y: 240 }, { x: 360, y: 240 + 5 }));
}

function draw() {
  // step simulation
  timings.simulation = performance.now();
  times(STEPS, () => step(1 / STEPS));
  timings.simulation = performance.now() - timings.simulation;

  // render simulation
  timings.render = performance.now();
  render();
  timings.render = performance.now() - timings.render;

  // report timing
  for (const [k, v] of Object.entries(timings)) {
    timingsLowPass[k] = lerp(timingsLowPass[k] ?? v, v, 0.01);
  }
  debugInfo.html(
    `render: ${timingsLowPass.render.toFixed(0)}ms<br>
    grain: ${timingsLowPass.grain.toFixed(0)}ms<br>
    blur: ${timingsLowPass.blur.toFixed(0)}ms<br>
    simulation: ${timingsLowPass.simulation.toFixed(0)}ms<br>
    collisions (per step): ${timingsLowPass.collisions.toFixed(0)}ms<br>
    buildTree (per step): ${timingsLowPass.buildTree.toFixed(1)}ms<br>
    retrieveSum: ${timingsLowPass.rSum.toFixed(1)}ms<br>  
    <br>  
    particles: ${particles.length}<br>
    bacteria: ${bacteria.length}<br>
    springs: ${springs.length}<br>
    `
  );

  timings.rSum = 0;
}

function mousePressed() {
  // toggle playback
  isLooping() ? noLoop() : loop();
}

function step(t = 1) {
  // let the bacteria grow themselves
  for (const b of bacteria) {
    b.step(t);
  }

  // remove any dead bacteria
  filterInPlace(bacteria, (b) => b.isAlive);

  // handle collisions between bacteria
  relaxParticles(particles, 8, 20);

  // pull them toward the center
  gravityToward(particles, { x: 360, y: 240 }, 0.01);

  // step the springs
  for (const s of springs) {
    s.step(t);
  }

  // step the particles
  for (const p of particles) {
    p.step(t);
  }
}

function render() {
  // dark flickering background
  background(noise(frameCount * 0.2) * 10 + 10);

  if (DRAW_RENDER) {
    // draws the bacteria with a simple stroke on the spring
    const drawBacteria = () => {
      push();
      translate(xOffset, yOffset);
      noFill();
      stroke(200, 200, 220);
      strokeWeight(4);
      for (const s of springs) {
        line(s.a.position.x, s.a.position.y, s.b.position.x, s.b.position.y);
      }
      pop();
    };

    // draws the "123 min" text
    // the time isn't really based on minutes
    const drawText = () => {
      push();
      noStroke();
      fill(200);
      textSize(20);
      textFont("monospace");
      textAlign(RIGHT);
      text(`${floor(frameCount / 4)} min`, 100, 460);
      pop();
    };

    // calc camera shake
    noiseDetail(2, 0.5);
    let xOffset = noise(frameCount * 0.2);
    let yOffset = noise(frameCount * 0.2, 1);
    xOffset = xOffset * xOffset * 2;
    yOffset = yOffset * yOffset * 2;

    // first pass to get blurred
    drawBacteria();
    drawText();

    // easy glow/bloom
    timings.blur = performance.now();
    filter(BLUR, 4);
    timings.blur = performance.now() - timings.blur;

    // second pass
    drawBacteria();
    drawText();

    // easy film grain effect
    timings.grain = performance.now();
    addGrain();
    timings.grain = performance.now() - timings.grain;
  }

  if (DRAW_DEBUG) {
    push();
    noFill();
    stroke("red");
    strokeWeight(1);
    // circle the particles
    for (const p of particles) {
      ellipse(p.position.x, p.position.y, p.radius * 2, p.radius * 2);
    }
    // stroke the springs
    for (const s of springs) {
      line(s.a.position.x, s.a.position.y, s.b.position.x, s.b.position.y);
    }
    pop();
  }
}

function addGrain() {
  loadPixels();

  for (let i = 0; i < pixels.length; i += 4) {
    const x = (i / 4) % (width * pixelDensity());
    const y = floor(i / 4 / (width * pixelDensity()));
    const g = random(-15, 15);
    // const n = noise(x * 0.001, y * 0.001, frameCount * 0.1);
    // const g = map(n, 0, 1, -100, 100);
    pixels[i + 0] = pixels[i + 0] + g;
    pixels[i + 1] = pixels[i + 1] + g;
    pixels[i + 2] = pixels[i + 2] + g;
  }
  updatePixels();
}

function relaxParticles(particles, searchRadius = 100, k = 0.01) {
  timings.collisions = performance.now();

  // populate the quadtree with points
  // using the quadtree greatly reduces the number of collision comparisons
  // the tree is populated with an object with the bounding area and a reference to the particle
  // setting max_levels (argument 3) to 8 is yielding best performance
  const tree = new Quadtree({ x: 0, y: 0, width: 720, height: 480 }, 10, 8);

  timings.buildTree = performance.now();
  particles.forEach((p) => {
    tree.insert({ x: p.position.x, y: p.position.y, width: 0, height: 0, p });
  });
  timings.buildTree = performance.now() - timings.buildTree;

  for (const a of particles) {
    // get the near by particles
    // this will include some particles that are close but not touching
    // we'll check for touching next

    timings.r = performance.now();

    const nearBy = tree.retrieve({
      x: a.position.x - searchRadius,
      y: a.position.y - searchRadius,
      width: searchRadius,
      height: searchRadius,
    });

    timings.rSum += performance.now() - timings.r;

    // look at each near by particle
    for (const bRef of nearBy) {
      // get the particle associated with the reference from the quadtree
      const b = bRef.p;

      // skip thisparticle if it is the same one
      if (a === b) continue;

      // get a vector from b to a
      const dP = {
        x: b.position.x - a.position.x,
        y: b.position.y - a.position.y,
      };

      const effectRadius = a.radius + b.radius;
      // skip this particle if it is not touching
      // note we compare the squares of the distances to avoid a square root
      // this resulted in about a 40% speed up
      if (dP.x ** 2 + dP.y ** 2 > effectRadius ** 2) continue;
      const mP = magnitude(dP);
      const nP = normalize(dP, mP);

      // calculate the amount of force
      const relaxForce = ((mP - effectRadius) / effectRadius) * k;

      // apply force to both particles
      a.forces.x += nP.x * relaxForce;
      a.forces.y += nP.y * relaxForce;
      b.forces.x += nP.x * -relaxForce;
      b.forces.y += nP.y * -relaxForce;
    }
  }

  timings.collisions = performance.now() - timings.collisions;
}

function gravityToward(particles, target, k = 0.01) {
  for (const p of particles) {
    const dP = {
      x: target.x - p.position.x,
      y: target.y - p.position.y,
    };

    const nP = normalize(dP);

    const force = k;

    p.forces.x += nP.x * force;
    p.forces.y += nP.y * force;
  }
}

/// Vector 2D

// returns a new normalized v
// if a magnitude is passed in, it will be used
// to avoid the sqrt calculation
function normalize(v, m = magnitude(v)) {
  if (m === 0) return { x: 0, y: 0 };
  return { x: v.x / m, y: v.y / m };
}

function magnitude(v) {
  return dist(0, 0, v.x, v.y);
}

function magnitudeSquared(v) {
  return v.x * v.x + v.y * v.y;
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
    const dragMagnitude = magnitudeSquared(this.velocity) * kDRAG;
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
    const mP = magnitude(dP);
    const nP = normalize(dP, mP);

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
