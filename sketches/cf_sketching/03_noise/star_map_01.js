// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(512, 512);

  strokeWeight(2);
  noiseDetail(1);
  noFill();
}

function draw() {
  background(10, 15, 50);

  // glow
  for (let i = 0; i < 50; i++) {
    const t = frameCount * 0.003 + i * 0.1;
    const x = noiseFloat(width * 0.3, width * 0.7, i, 1, t);
    const y = noiseFloat(0, height, i, 2);
    const r = noiseFloat(350, 400, i, 3, t);
    noStroke();
    blendMode(ADD);
    fill(0, 2, 1);
    ellipse(x, y, r, r);
    blendMode(NORMAL);
  }

  // stars
  for (let i = 0; i < 200; i++) {
    const x = noiseFloat(0, width, i, 0);
    const y = noiseFloat(0, height, i, 1);
    const r = noiseFloat(0, 4, i, 2);
    const a = noiseFloat(100, 255, i, 3, frameCount * 0.1);
    if (noise(i, 4) < 0.01) {
      label(i, x, y);
    }
    noStroke();
    fill(255, a);
    ellipse(x, y, r, r);
  }
}

function label(seed, x, y) {
  push();
  translate(x, y);
  for (let i = 0; i < 15; i++) {
    const a = map(i, 0, 15, 0, 2 * PI);
    push();
    rotate(a + frameCount * 0.01);
    scale(noiseFloat(1, 1.5, seed));
    translate(0, 30);
    stroke(255);
    strokeWeight(1);
    rune(seed * 1000 + i, 3);
    pop();
  }
  pop();
}

function rune(seed, s = 10) {
  if (noiseBool(seed, 1)) {
    line(0, 0, s, 0);
    if (noiseBool(seed, 5)) line(s, 0, s, -s);
    if (noiseBool(seed, 6)) line(s, 0, s, s);
  }
  if (noiseBool(seed, 2)) {
    line(0, 0, 0, s);
    if (noiseBool(seed, 5)) line(0, s, -s, s);
    if (noiseBool(seed, 6)) line(0, s, s, s);
  }
  if (noiseBool(seed, 3)) {
    line(0, 0, -s, 0);
    if (noiseBool(seed, 5)) line(-s, 0, -s, -s);
    if (noiseBool(seed, 6)) line(-s, 0, -s, s);
  }
  if (noiseBool(seed, 4)) {
    line(0, 0, 0, -s);
    if (noiseBool(seed, 5)) line(0, -s, -s, -s);
    if (noiseBool(seed, 6)) line(0, -s, s, -s);
  }
}

function noiseBool(x, y, z) {
  return noise(x, y, z) < 0.25;
}

function noiseFloat(min, max, x, y = 0, z = 0) {
  return map(noise(x, y, z), 0, 0.5, min, max);
}
