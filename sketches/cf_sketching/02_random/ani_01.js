// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");

// lets tart with some color study
// https://albersfoundation.org/art/anni-albers/weavings/#slide13

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  frameRate(1);
};

window.draw = function () {
  // pick params
  const colors = [];
  const hue = random();
  colors[0] = color(hue, random(0.1, 0.2), random(0.1, 0.2)); // black
  colors[1] = color(hue, random(0.1, 0.2), random(0.6, 0.7)); // gray
  colors[2] = color(hue, random(0.3, 0.7), random(0.5, 1.0));
  const bg = color(hue, 0.1, 0.8);
  const margin = random(10, height * 0.25);
  const cols = floor(middleRandom(1, 10));
  const rows = floor(middleRandom(1, 15));

  background(bg);

  const w = width - 2 * margin;
  const h = height - 2 * margin;
  const col_width = w / cols;
  const row_height = h / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      fill(pick(colors));
      noStroke();
      const x = margin + col * col_width;
      const y = margin + row * row_height;
      rect(x, y, col_width - 1, row_height - 1);
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

let play = false;
function mousePressed() {
  play = !play;
  play ? loop() : noLoop();
}

// ideas
// should i draw stiches?
// post process some zigzag?

function wrap(v, min = 0, max = 1) {
  const w = max - min;
  while (v < min) v += w;
  while (v > max) v -= w;
  return v;
}
