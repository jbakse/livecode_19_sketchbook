// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let g1;
let g2;

function setup() {
  pixelDensity(1);
  createCanvas(512, 512);
  g1 = createGraphics(128, 128);
  g1.background(0);
  g1.fill(255);
  g1.noStroke();
  g1.noSmooth();
  g1.ellipse(64, 64, 8, 8);

  g2 = createGraphics(128, 128);
}

function draw() {
  g1.loadPixels();
  g2.loadPixels();

  // copy each pixel from g1 to g2
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const c = getC(g1, x, y);
      setC(g2, x, y, c);
    }
  }

  g2.updatePixels();

  // blit g2 to g1
  g1.copy(g2, 0, 0, 128, 128, 0, 0, 128, 128);

  noSmooth();
  image(g1, 0, 0, 512, 512);
}

function getC(g, x, y) {
  x = constrain(x, 0, g.width);
  y = constrain(y, 0, g.width);
  const i = (y * g.width + x) * 4;
  return [g.pixels[i + 0], g.pixels[i + 1], g.pixels[i + 2], g.pixels[i + 3]];
}

function setC(g, x, y, c) {
  x = constrain(x, 0, g.width);
  y = constrain(y, 0, g.width);
  const i = (y * g.width + x) * 4;
  g.pixels[i + 0] = c[0];
  g.pixels[i + 1] = c[1];
  g.pixels[i + 2] = c[2];
  g.pixels[i + 3] = c[3];
}
