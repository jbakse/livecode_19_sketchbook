// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let turn2Slider;
let a1 = 0;
let a2 = 0;

let noiseStrengthSlider;
let noiseSpeedSlider;

/* global createSlider createP */

function setup() {
  createCanvas(500, 500);

  createP("turn2");
  turn2Slider = createSlider(1, 21, 9);

  createP("noiseStrength");
  noiseStrengthSlider = createSlider(0, 1000, 500);
  createP("noiseSpeed");
  noiseSpeedSlider = createSlider(0, 1000, 10);

  background(0, 0, 0);

  noFill();
  noStroke();
  blendMode(ADD);
  colorMode(HSB, 1);

  noiseDetail(1);
}

function mousePressed() {
  blendMode(BLEND);
  background(0, 0, 0);
}

function draw() {
  const noiseStrength = map(noiseStrengthSlider.value(), 0, 1000, 0, 0.1);
  const noiseSpeed = map(noiseSpeedSlider.value(), 0, 1000, 0, 0.5);

  for (let i = 0; i < 1000; i++) {
    step(0, noiseStrength, noiseSpeed, 10.0);
    step(0.25, noiseStrength, noiseSpeed, 10.05);
    step(0.5, noiseStrength, noiseSpeed, 10.1);
    step(0.75, noiseStrength, noiseSpeed, 10.15);
  }
}

function step(c, noiseStrength, noiseSpeed, noiseZ) {
  const size = 1;
  const bright = 0.1;
  const r1 = 250;
  const r2 = 50;
  const turn1 = 0.001;
  const turn2 = turn1 * turn2Slider.value();

  let x = 250;
  let y = 250;

  a1 += turn1;
  const noisyA1 = a1 + noise(a1 * noiseSpeed, noiseZ) * noiseStrength;
  const noiseR1 = r1 * (noise(a1 * noiseSpeed, noiseZ) + 0.25);
  x += sin(noisyA1) * noiseR1;
  y -= cos(noisyA1) * noiseR1;

  a2 += turn2;
  const noisyA2 = a2 + noise(a1 * noiseSpeed, noiseZ) * noiseStrength;
  const noiseR2 = r2 * (noise(a1 * noiseSpeed * 1000, noiseZ) + 0.25);
  x += sin(noisyA2) * noiseR2;
  y -= cos(noisyA2) * noiseR2;

  colorMode(HSB, 1);
  blendMode(ADD);
  fill(c, 1, bright);
  ellipse(x, y, size, size);
}

// [version 1](https://jsbin.com/jibuvuvesi/edit?js,output)
// [version 2](https://jsbin.com/munecawaqo/edit?js,output)
// [version 3](https://jsbin.com/zasosuyadi/edit?js,output)
// [version 4](https://jsbin.com/juviqopive/edit?js,output)

function keyPressed() {
  if (key === "S") {
    save("canvas.jpg");
  }
}
