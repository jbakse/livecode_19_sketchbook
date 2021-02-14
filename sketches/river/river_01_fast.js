// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
const CELL_SIZE = 1;
const NOISE_SCALE = 1 / 300;
const FLOW_SPEED = 100;
const TURBULENCE = 0.1;
const NOISE_DETAIL = 4;
const NORMAL_CONTRAST = 100;
const LIT_CONTRAST = 20;

// this sketch tries two alternate rendering methods
// version 1: same as previous sketch, renders to the canvas directly using ellipse(), on my machine a 2x pixel density canvas
// version 2: bumpPixel directly sets the canvas pixel values
// version 3: renders to 1024x1024 graphics

// speed test 100 particles, 100 steps,
// version 1: 390 ms
// version 2: 230 ms
// version 3a (hidden): 390ms
// version 3b (shown): 1200ms

// version 1 always draws at least 2x2 pixels, even if the radius was .5 or .25

// version 2 is fastest and targets a single pixel for finer detail
// version 2 doesn't have antialiasing

// version 3 uses ellipse but does draw single pixel ellipses, its not much slower if you don't display the render

// interested in doing a version with drawing to a float array for HDR
// also could look at moving to float, exr?
// exr code in smudge?

/* exported setup draw renderHeightMap  renderNormalMap renderLit */
let render;

function setup() {
  createCanvas(512, 512);
  render = createGraphics(1024, 1024);
  render.background(0);
  colorMode(RGB, 1);

  noStroke();
  noiseDetail(NOISE_DETAIL);

  background(0);
  //renderHeightMap();
  //renderNormalMap();
  //renderLit();
}

function ridgedNoise(x, y) {
  return 1 - abs(noise(x * NOISE_SCALE, y * NOISE_SCALE) - 0.5) * 2;
}

function warpRidgedNoise(x, y) {
  const xx = noise(x * NOISE_SCALE, y * NOISE_SCALE, 1);
  const yy = noise(x * NOISE_SCALE, y * NOISE_SCALE, 2);
  return ridgedNoise(x + xx * 1000, y + yy * 1000);
}

function coneBias(x, y) {
  const d = dist(x, y, 256, 256);
  return map(d, 0, 256, -1, 1);
}

function totalNoise(x, y) {
  return (warpRidgedNoise(x, y) + coneBias(x, y)) / 2;
}

function totalNoiseNormal(x, y) {
  const n = totalNoise(x, y);
  const nx = totalNoise(x - 1, y);
  const ny = totalNoise(x, y - 1);
  return { x: n - nx, y: n - ny };
}

function renderHeightMap() {
  for (let y = 0; y < 512; y += CELL_SIZE) {
    for (let x = 0; x < 512; x += CELL_SIZE) {
      let v = totalNoise(x, y);
      fill(v);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function renderNormalMap() {
  for (let y = 0; y < 512; y += CELL_SIZE) {
    for (let x = 0; x < 512; x += CELL_SIZE) {
      const n = totalNoiseNormal(x, y);
      fill(n.x * NORMAL_CONTRAST, n.y * NORMAL_CONTRAST, 1);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function renderLit() {
  for (let y = 0; y < 512; y += CELL_SIZE) {
    for (let x = 0; x < 512; x += CELL_SIZE) {
      const n = totalNoiseNormal(x, y);
      const l =
        constrain(-n.x * LIT_CONTRAST * 0.5 + 0.25, 0, 1) +
        constrain(-n.y * LIT_CONTRAST + 0.25, 0, 1);
      fill(l);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function draw() {
  render.colorMode(HSB, 1);
  render.fill(1, 1, 1, 0.2);
  render.noStroke();

  for (let particle = 0; particle < 100; particle++) {
    let x = random(width);
    let y = random(height);

    for (let step = 0; step < 1000; step++) {
      const n = totalNoiseNormal(x, y);
      x -= n.x * FLOW_SPEED;
      y -= n.y * FLOW_SPEED;
      x += random(-TURBULENCE, TURBULENCE);
      y += random(-TURBULENCE, TURBULENCE);

      render.ellipse(x * 2, y * 2, 1, 1);
    }
  }

  image(render, 0, 0, 512, 512);
}

function bumpPixel(x, y) {
  x = floor(x * 2) * 0.5;
  y = floor(y * 2) * 0.5;
  let d = pixelDensity();
  let i = (y * d * width * d + x * d) * 4;
  //pixels[i] = pixels[i] + 50;
  //pixels[i] = pixels[i] * 0.8 + 255 * 0.2;
  pixels[i] = lerp(pixels[i], 255, 0.2);
}
