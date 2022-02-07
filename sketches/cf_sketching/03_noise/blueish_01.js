// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js

// mixing wang tiles (kinda) and bayer dithering

// inspired roughly by https://www.cs.tau.ac.il/~dcor/articles/2006/Recursive-Wang.pdf

// and this https://surma.dev/things/ditherpunk/

/* exported setup draw */
/* global Tweakpane */

const pane = new Tweakpane.Pane();
const params = {
  levels: 4,
};
const tiles = [
  [0, 0.25, 0.5, 0.75],
  [0.25, 0.75, 0.0, 0.5],
  [0.75, 0.5, 0.25, 0.0],
  [0.5, 0, 0.75, 0.25],
];
function setup() {
  pixelDensity(1);
  const c = createCanvas(320, 256);
  c.style("min-width", "640px");
  c.style("min-height", "512px");
  c.style("image-rendering", "pixelated");

  pane
    .addInput(params, "levels", { min: 2, max: 16, step: 1 })
    .on("change", draw);

  noLoop();
}

// eslint-disable-next-line complexity
function draw() {
  background(0);
  loadPixels();

  const column = 64;
  // draw noise
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < column * 1; x += 2) {
      const tile = random(tiles);
      for (let b = 0; b < 2; b++) {
        for (let a = 0; a < 2; a++) {
          const n = tile[b * 2 + a];
          const q = roundTo(n * 255, 1);
          const c = [q, q, q, 255];
          setQuick(x + a, y + b, c);
        }
      }
    }
  }

  // draw smooth gradient
  for (let y = 0; y < height; y += 1) {
    for (let x = column * 1; x < column * 2; x += 1) {
      const g = y / height;
      const q = roundTo(g * 255, 1);
      const c = [q, q, q, 255];
      setQuick(x, y, c);
    }
  }

  // draw quantized gradient
  for (let y = 0; y < 512; y += 1) {
    for (let x = column * 2; x < column * 3; x += 1) {
      const g = y / height;
      const q = roundTo(g * 256, 256 / params.levels);
      const c = [q, q, q, 255];
      setQuick(x, y, c);
    }
  }

  // draw dithered gradient
  for (let y = 0; y < height; y += 2) {
    for (let x = column * 3; x < column * 4; x += 2) {
      const tile = random(tiles);
      for (let b = 0; b < 2; b++) {
        for (let a = 0; a < 2; a++) {
          const n = tile[b * 2 + a] / params.levels;
          const g = (y + b) / height;
          const q = roundTo((g + n) * 256, 256 / params.levels);
          const c = [q, q, q, 255];
          setQuick(x + a, y + b, c);
        }
      }
    }
  }

  // draw random dithered gradient
  for (let y = 0; y < height; y += 1) {
    for (let x = column * 4; x < column * 5; x += 1) {
      const n = random() / params.levels;
      const g = y / height;
      const q = roundTo((g + n) * 256, 256 / params.levels);
      const c = [q, q, q, 255];
      setQuick(x, y, c);
    }
  }

  updatePixels();
}

// function getQuick(x, y) {
//   const index = constrain((y * width + x) * 4, 0, width * height * 4);
//   return [
//     pixels[index + 0],
//     pixels[index + 1],
//     pixels[index + 2],
//     pixels[index + 3],
//   ];
// }

function setQuick(x, y, c) {
  const index = constrain((y * width + x) * 4, 0, width * height * 4);

  pixels[index + 0] = c[0];
  pixels[index + 1] = c[1];
  pixels[index + 2] = c[2];
  pixels[index + 3] = c[3];
}

function roundTo(n, q) {
  return floor(n / q) * q;
}
