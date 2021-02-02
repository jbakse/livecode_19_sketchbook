// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");

// lets start with some color study
// and then add some texture
// improve texture
// fix the overlap bug
// i kind of like the overlap bug, maybe bring it back on purpose
// add some weaving to background
// add some noise textures on top

// https://albersfoundation.org/art/anni-albers/weavings/#slide13

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  frameRate(0.5);
  draw();
};

window.draw = function () {
  // pick params
  const colors = [];
  let hue = random();
  colors[0] = color(hue, random(0.1, 0.2), random(0.0, 0.2)); // black
  colors[1] = color(hue, random(0.1, 0.2), random(0.6, 0.7)); // gray
  colors[2] = color(hue, random(0.4, 0.9), random(0.5, 1.0)); // accent
  const bg = color(hue, 0.1, 0.8);
  const margin = roundTo(random(10, height * 0.25), 8);

  const cols = floor(middleRandom(1, 10));
  const rows = floor(middleRandom(1, 15));

  background(bg);
  weaveRect(0, 0, width, height, color(0, 0, 1, 0), 1, 1);

  const w = width - 2 * margin;
  const h = height - 2 * margin;
  const col_width = w / cols;
  const row_height = h / rows;

  for (let row = rows - 1; row >= 0; row--) {
    for (let col = cols - 1; col >= 0; col--) {
      const x = margin + col * col_width;
      const y = margin + row * row_height;
      weaveRect(
        x,
        y,
        col_width,
        row_height,
        pick(colors),
        randomInt(2),
        lowRandom(1, 4)
      );
    }
  }

  push();

  addNoise(0, 0, width, height, 8, color(1, 0, 0.5, 0), color(1, 0, 0.5, 0.05));

  addNoise(0, 0, width, height, 2, color(1, 0, 1, 0), color(1, 0, 1, 0.05));
  pop();
};

function addNoise(x, y, w, h, cell_size = 8, c1, c2) {
  const col_width = cell_size;
  const row_height = cell_size;
  const cols = floor(w / col_width) + 1;
  const rows = floor(h / row_height) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xx = col * col_width;
      const yy = row * row_height;

      fill(lerpColor(c1, c2, random()));
      ellipse(x + xx, y + yy, col_width * 3, row_height * 3);
    }
  }
}
function pick(a) {
  return a[randomInt(a.length)];
}
function randomInt(a, b) {
  return floor(random(a, b));
}
function middleRandom(min, max) {
  return (random(min, max) + random(min, max)) * 0.5;
}
function lowRandom(min, max) {
  return Math.min(random(min, max), random(min, max));
}

let play = false;
function mousePressed() {
  play = !play;
  play ? loop() : noLoop();
}

// ideas
// should i draw stiches?
// post process some zigzag?

function wrap(v, min = 0, max = 1) {
  let w = max - min;
  while (v < min) v += w;
  while (v > max) v -= w;
  return v;
}

function roundTo(v, r) {
  return round(v / r) * r;
}
function weaveRect(x, y, w, h, c, solid, messy) {
  // goal width height
  let col_width = 8;
  let row_height = 8;
  // calculate number of rows/cols
  let cols = floor(w / col_width);
  let rows = floor(h / row_height);
  // find exact size of cols/rows
  col_width = w / cols;
  row_height = h / rows;

  if (random() < 0.05) {
    rows++;
  }
  if (random() < 0.05) {
    cols++;
  }

  for (let row = 0; row < rows; row++) {
    const wide = random() < 0.01 ? 1 : 0;
    for (let col = 0; col < cols + wide; col++) {
      push();
      fill(lerpColor(c, color(0, 0, 0, 0), 0.1));
      noStroke();
      const xx = col * col_width;
      const yy = row * row_height;

      if (col % 2 && !solid) continue;

      translate(x + xx, y + yy);
      rotate(random(-PI, PI) * 0.01 * messy);
      translate(random(messy * 0.02), random(messy * 0.02));

      rect(0, 0, col_width, row_height);

      // hilight
      stroke(1, 0, 1, 0.2);
      line(0, 0, col_width, 0);
      line(0, 0, 0, row_height);

      // lowlight
      stroke(1, 0, 0, 0.1);
      line(col_width, row_height, col_width, 0);
      line(col_width, row_height, 0, row_height);
      pop();
    }
  }
}
