// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

let g;

function setup() {
  createCanvas(600, 600);
  g = createGraphics(128, 128);
  g.pixelDensity(1);

  g.background(0);
  g.fill(255);
  g.noStroke();
  g.noSmooth();
  g.ellipse(64, 64, 96, 96);

  noiseDetail(8);
}

function draw() {
  // g.background("gray");

  g.loadPixels();
  for (let i = 0; i < 128; i++) {
    const x = floor(random(128));
    const y = floor(random(128));
    const c = getC(g, x, y);

    if (c[0] > 0) {
      let r = map(dist(x, y, 32, 32), 0, 100, 255, 50, true);
      setC(g, x + 1, y, [r, 0, 0, 255]);
      setC(g, x - 1, y, [r, 0, 0, 255]);
      setC(g, x, y + 1, [r, 0, 0, 255]);
      setC(g, x, y - 1, [r, 0, 0, 255]);
    }
  }
  g.updatePixels();

  noSmooth();
  image(g, 0, 0, 600, 600);
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
