// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* globals  Tweakpane */
/* exported setup draw */

const pane = new Tweakpane();

const params = {};
const drops = [];

function setup() {
  createCanvas(600, 600);
  noStroke();
  noiseDetail(1);
  colorMode(HSB, 1);
  params.seed_count = 4;
  pane.addInput(params, "seed_count", { min: 0, max: 100, step: 1 });
  params.seed_size = 50;
  pane.addInput(params, "seed_size", { min: 10, max: 100, step: 1 });
  params.spread_count = 10;
  pane.addInput(params, "spread_count", { min: 0, max: 50, step: 1 });
}

function draw() {
  background(0);
  // seed drops
  id_counter = 0;
  drops.splice(0);
  for (let i = 0; i < params.seed_count; i++) {
    drops.push(
      new Drop(
        noiseRange(0, width, id_counter, 0, frameCount * 0.001),
        noiseRange(0, height, id_counter, 1, frameCount * 0.001),
        noiseRange(
          params.seed_size * 0.8,
          params.seed_size * 1.2,
          id_counter,
          2,
          frameCount * 0.001
        )
      )
    );
  }

  // spread
  {
    const start_length = drops.length;
    for (let drop_index = 0; drop_index < start_length; drop_index++) {
      const drop = drops[drop_index];
      if (drop.hidden) continue;
      for (let i = 0; i < params.spread_count; i++) {
        const a = map(i, 0, params.spread_count, 0, 2 * PI);
        const r = (drop.r * 1.4 * PI) / params.spread_count;
        const x = drop.x + sin(a) * drop.r * 1.5;
        const y = drop.y + cos(a) * drop.r * 1.5;
        drops.push(new Drop(x, y, r));
      }
    }
  }

  // spread again
  {
    const start_length = drops.length;
    for (let drop_index = 0; drop_index < start_length; drop_index++) {
      const drop = drops[drop_index];
      if (drop.hidden) continue;
      for (let i = 0; i < params.spread_count; i++) {
        const a = map(i, 0, params.spread_count, 0, 2 * PI);
        const r = (drop.r * 1.4 * PI) / params.spread_count;
        const x = drop.x + sin(a) * drop.r * 1.5;
        const y = drop.y + cos(a) * drop.r * 1.5;
        drops.push(new Drop(x, y, r));
      }
    }
  }

  // draw
  for (const drop of drops) {
    drop.draw();
  }
}

let id_counter;
class Drop {
  constructor(x, y, r) {
    this.id = id_counter++;
    this.x = x;
    this.y = y;
    this.r = r;
    this.hidden = false;
    for (const drop of drops) {
      if (drop.hidden) continue;
      if (abs(this.x - drop.x) > this.r + drop.r) continue;
      if (abs(this.y - drop.y) > this.r + drop.r) continue;
      if (dist(this.x, this.y, drop.x, drop.y) < this.r + drop.r) {
        this.hidden = true;
      }
    }
  }
  draw() {
    const hue = map(
      dist(this.x, this.y, width * 0.5, height * 0.5),
      0,
      width * 0.5,
      0,
      1
    );
    fill(hue, 1, 1);
    if (this.hidden) {
      noFill();
      //fill(255, 10);
    }
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

function noiseRange(min, max, ...a) {
  return noise(...a) * 2 * (max - min) + min;
}

function noiseInt(min, max, ...a) {
  return floor(noise(...a) * 2 * (max - min) + min);
}
