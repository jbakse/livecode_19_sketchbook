// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");

// lets start with some color study
// and then add some texture
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
  colors[0] = color(hue, random(0.1, 0.2), random(0.1, 0.2)); // black
  colors[1] = color(hue, random(0.1, 0.2), random(0.6, 0.7)); // gray
  colors[2] = color(hue, random(0.3, 0.7), random(0.5, 1.0));
  const bg = color(hue, 0.1, 0.8);
  const margin = random(10, h * 0.25);
  const cols = floor(middleRandom(1, 10));
  const rows = floor(middleRandom(1, 15));

  background(bg);

  const w = width - 2 * margin;
  const h = h - 2 * margin;
  const col_width = w / cols;
  const row_height = h / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = margin + col * col_width;
      const y = margin + row * row_height;
      weaveRect(
        x,
        y,
        col_width,
        row_height,
        pick(colors),
        randomInt(2),
        lowRandom(0, 2)
      );
    }
  }
};

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

function weaveRect(x, y, w, h, c, solid, messy) {
  const col_width = 8;
  const row_height = 8;
  const cols = w / col_width;
  const rows = h / row_height;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      push();
      fill(lerpColor(c, color(0, 0, 0, 0), 0.1));
      noStroke();
      const xx = col * col_width;
      const yy = row * row_height;

      if (col % 2 && !solid) continue;
      translate(x + xx, y + yy);
      rotate(random(PI) * 0.01 * messy);
      r(
        0 + random(messy * 0.2),
        0 + random(messy * 0.2),
        col_width,
        row_height
      );

      rotate(random(PI) * 0.01 * messy);
      r(
        0 + random(messy * 0.2),
        0 + random(messy * 0.2),
        col_width - 1,
        row_height
      );

      pop();
    }
  }
}
