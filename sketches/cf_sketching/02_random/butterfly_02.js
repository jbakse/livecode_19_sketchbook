// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const ENERGY = 0.2;

function setup() {
  createCanvas(512, 512);
  colorMode(HSB, 1);
  //   frameRate(1);
  noLoop();
}

function draw() {
  background("black");
  noStroke();
  fill(0, 1, 1);
  translate(256, 256);

  for (let i = 0; i < 100; i++) {
    let x = 0;
    let y = middleRandom(-256, 256);
    let r = 2;
    let dX = 0;
    let dY = 0;
    let dR = 0;
    // fill(map(i, 0, 100, 0, 1), 1, 1); // color based on i
    fill(map(y, -256, 256, 0, 1), 1, 1);
    for (let step = 0; step < 100; step++) {
      x += dX;
      dX += random(-1, 1) * ENERGY;
      y += dY;
      dY += random(-1, 1) * ENERGY;
      r += dR;
      dR += random(-1, 1) * ENERGY;
      ellipse(+x, y, r, r);
      ellipse(-x, y, r, r);
    }
  }
}

function middleRandom(_min, _max, _bias = 2) {
  const rolls = Array.from({ length: _bias }, () => random(_min, _max));

  const average = rolls.reduce((a, b) => a + b) / rolls.length;
  return average;
}

function middleRandom(_min, _max, _bias = 2) {
  const rolls = Array.from({ length: _bias }, () => random(_min, _max));

  const average = rolls.reduce((a, b) => a + b) / rolls.length;
  return average;
}
