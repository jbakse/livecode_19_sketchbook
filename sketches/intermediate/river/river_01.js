// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
const CELL_SIZE = 1;
const NOISE_SCALE = 1 / 300;
const NORMAL_BRIGHT = 20;
const FLOW_SPEED = 100;
const TURBULENCE = 0.1;

let x = 256;
let y = 256;

function setup() {
  pixelDensity(1);
  createCanvas(512, 512);

  colorMode(RGB, 1);
  noStroke();
  noiseDetail(4);

  background(0);
  //   heightMap();
  //   light();
  //   normalMap();
}

function ridge(x, y) {
  return 1 - abs(noise(x * NOISE_SCALE, y * NOISE_SCALE) - 0.5) * 2;
}

function warpRidge(x, y) {
  const xx = noise(x * NOISE_SCALE, y * NOISE_SCALE, 1);
  const yy = noise(x * NOISE_SCALE, y * NOISE_SCALE, 2);
  return ridge(x + xx * 1000, y + yy * 1000);
}

function bias(x, y) {
  const d = dist(x, y, 256, 256);
  return map(d, 0, 256, -1, 1);
}

function n(x, y) {
  return (warpRidge(x, y) + bias(x, y)) / 2;
}

function heightMap() {
  for (let y = 0; y < 512; y += CELL_SIZE) {
    for (let x = 0; x < 512; x += CELL_SIZE) {
      let v = n(x, y);
      fill(v);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function normalMap() {
  for (let y = 0; y < 512; y += CELL_SIZE) {
    for (let x = 0; x < 512; x += CELL_SIZE) {
      const nx = (n(x, y) - n(x - 1, y)) * NORMAL_BRIGHT + 0.5;
      const ny = (n(x, y) - n(x, y - 1)) * NORMAL_BRIGHT + 0.5;
      fill(nx, ny, 1);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function light() {
  for (let y = 0; y < 512; y += CELL_SIZE) {
    for (let x = 0; x < 512; x += CELL_SIZE) {
      //   const nx = (n(x, y) - n(x - 1, y)) * NORMAL_BRIGHT + 0.5;
      const ny = (n(x, y) - n(x, y - 1)) * NORMAL_BRIGHT + 0.5;
      fill(ny);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}
let h = 0;
function draw() {
  for (let ll = 0; ll < 10; ll++) {
    x = random(width);
    y = random(height);

    // h = map(x, 0, width, 0, 1);

    colorMode(HSB, 1);
    fill(1, 1, 1, 0.2);
    for (let l = 0; l < 1000; l++) {
      const nx = n(x, y) - n(x - 1, y);
      const ny = n(x, y) - n(x, y - 1);
      x -= nx * FLOW_SPEED;
      y -= ny * FLOW_SPEED;
      x += random(-TURBULENCE, TURBULENCE);
      y += random(-TURBULENCE, TURBULENCE);

      ellipse(x, y, 1, 1);
    }
  }
}
