// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

v = 0;
p = 0;

function setup() {
  createCanvas(128, 64);
  noStroke();
  colorMode(HSB, 9);
}

function draw() {
  background(0);

  k = keyIsDown;
  k(65) && p--;
  k(68) && p++;

  v = lerp(v, p, 0.05);
  translate(-floor(v) + 64, 0);
  const cc = floor(v / 16);
  n = noise;
  f = fill;
  for (let c = cc - 4; c < cc + 5; c++) {
    n(c) > 0.5 ? f(1) : f(2);
    rect(c * 16, 48, 16, 16);
    n(c, 2) > 0.6 ? f(n(c, 4) * 9, 7, 7) : f(0);
    rect(c * 16, 32, 16, 16);
    n(c * 0.1, 3) > 0.5 ? f(7) : f(0);
    rect(c * 16, 0, 16, 16);
  }
  f(255);
  rect(p - 16, 32, 16, 16);
}
