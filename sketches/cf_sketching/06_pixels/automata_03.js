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
  g.ellipse(random(128), random(128), 32, 32);
  g.ellipse(random(128), random(128), 32, 32);
  g.ellipse(random(128), random(128), 32, 32);

  g.loadPixels();
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const c = getC(g, x, y);
      c[0] = c[0] < 128 ? 0 : 255;
      c[1] = 0; //c[1] < 128 ? 0 : 255;
      c[2] = 0; //c[2] < 128 ? 0 : 255;
      setC(g, x, y, c);
    }
  }
  g.updatePixels();
  noiseDetail(8);
}

function draw() {
  g.loadPixels();
  for (let i = 0; i < 128 * 10; i++) {
    const x = floor(random(128));
    const y = floor(random(128));
    const c = getC(g, x, y);
    const cl = getC(g, x - 2, y);
    const cr = getC(g, x + 2, y);
    const ct = getC(g, x, y - 2);
    const cb = getC(g, x, y + 2);

    if (c[0] > 0) {
      if (cl[0] == 0) setC(g, x - 1, y, [255, 0, 0, 255]);
      if (cr[0] == 0) setC(g, x + 1, y, [255, 0, 0, 255]);
      if (ct[0] == 0) setC(g, x, y - 1, [255, 0, 0, 255]);
      if (cb[0] == 0) setC(g, x, y + 1, [255, 0, 0, 255]);
      setC(g, x, y, [constrain(c[0] - 10, 0, 255), 0, 0, 255]);
    } else {
      //nothing
    }
  }
  g.updatePixels();

  noSmooth();
  image(g, 0, 0, 600, 600);
}
function getC(g, x, y) {
  x = constrain(x, 0, g.width);
  y = constrain(y, 0, g.height);
  const i = (y * g.width + x) * 4;

  return [g.pixels[i + 0], g.pixels[i + 1], g.pixels[i + 2], g.pixels[i + 3]];
}

function setC(g, x, y, c) {
  x = constrain(x, 0, g.width);
  y = constrain(y, 0, g.height);
  const i = (y * g.width + x) * 4;

  g.pixels[i + 0] = c[0];
  g.pixels[i + 1] = c[1];
  g.pixels[i + 2] = c[2];
  g.pixels[i + 3] = c[3];
}
