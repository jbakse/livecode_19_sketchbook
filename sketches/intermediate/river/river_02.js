// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
const CELL_SIZE = 4;
const NOISE_SCALE = 1 / 300;
const NORMAL_BRIGHT = 20;
const FLOW_SPEED = 100;
const FLOW_TIME = 200;
const TURBULENCE = 0.0;
const BUILD = 0.1;
const PARTICLE_SIZE = 0.5;
const STUCK_THRESHOLD = 0.0001;
const SAMPLE_SPACING = 2;

let x = 256;
let y = 256;
let img;

/* global sketch_directory */
function preload() {
  img = loadImage(sketch_directory + "makwa.png");
}
function setup() {
  createCanvas(512, 512);

  colorMode(RGB, 1);
  noStroke();
  noiseDetail(4);

  background(0);
  img.loadPixels();

  //   image(img, 0, 0, 512, 512);
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

function radial_bias(x, y) {
  const d = dist(x, y, 256, 256);
  return map(d, 0, 256, -1, 1);
}

function vertical_bias(x, y) {
  return y * 0.01;
}

function getQuick(img, x, y) {
  var i = (y * img.width + x) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function n(x, y) {
  //   return (warpRidge(x, y) + radial_bias(x, y)) / 2;

  let v;

  v = 0;

  v += sample_image(x, y);
  v += radial_bias(x, y) * 0.4;
  //   v += vertical_bias(x, y) * -0.8;
  v += warpRidge(x, y) * 0.1;
  v *= 0.4;
  return v;
}

function sample_image(x, y) {
  return getQuick(img, floor(x * 4), floor(y * 4))[0] / 255;
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
  colorMode(HSB, 1);

  for (let ll = 0; ll < 20; ll++) {
    let x = middle_random(width);
    let y = middle_random(height);
    fill(random(0.9, 1.3) % 1, 1, 1, BUILD /* * map(l, 0, FLOW_TIME, 1, 0)*/);

    // fill(map(n(x, y), 0.2, 0.3, 0.3, 0.1, true), 1, 1, BUILD);
    // let a = 1;
    for (let l = 0; l < FLOW_TIME; l++) {
      const nx = n(x, y) - n(x - SAMPLE_SPACING, y);
      const ny = n(x, y) - n(x, y - SAMPLE_SPACING);

      x += nx * FLOW_SPEED;
      y += ny * FLOW_SPEED;

      x += random(-TURBULENCE, TURBULENCE);
      y += random(-TURBULENCE, TURBULENCE);
      if (dist(0, 0, nx, ny) < STUCK_THRESHOLD) {
        break;
      }
      //   const b = map(n(x, y), 0.2, 0.6, 1, 0.2, true);
      ellipse(x, y, PARTICLE_SIZE, PARTICLE_SIZE);
    }
  }
}

function middle_random(x) {
  return (random(x) + random(x)) / 2;
}
