// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require /sketches/libraries/webm-writer-0.3.0.js
// require /sketches/util/grabber_01.js

/*exported setup draw */

let g;

let grabber = new Grabber();

function setup() {
  pixelDensity(1);
  createCanvas(512, 512);
  g = createGraphics(512, 512);
  g.pixelDensity(1);

  g.background(0);
  g.fill(255);
  g.noStroke();
  g.noSmooth();
  g.ellipse(random(g.width), random(g.height), 4, 4);
  g.ellipse(random(g.width), random(g.height), 4, 4);
  g.ellipse(random(g.width), random(g.height), 4, 4);

  //   g.textSize(100);
  //   g.text("CF", 10, 100);
  g.loadPixels();
  for (let y = 0; y < g.height; y++) {
    for (let x = 0; x < g.width; x++) {
      const c = getC(g, x, y);
      c[0] = c[0] < 128 ? 0 : 255;
      c[1] = 0; //c[1] < 128 ? 0 : 255;
      c[2] = 0; //c[2] < 128 ? 0 : 255;
      setC(g, x, y, c);
    }
  }
  g.updatePixels();
  noiseDetail(4);

  grabber.grabFrames(120);
}

function draw() {
  g.loadPixels();
  for (let i = 0; i < g.width * g.height * 10; i++) {
    const x = floor(random(g.width));
    const y = floor(random(g.height));

    const c = getC(g, x, y);
    const cl = getC(g, x - 1, y);
    const cr = getC(g, x + 1, y);
    const ct = getC(g, x, y - 1);
    const cb = getC(g, x, y + 1);

    const r = random();
    const n = noise(x * 0.01, y * 0.03, frameCount * 0.01);
    // if (pow(noise(x * 0.01, y * 0.03, frameCount * 0.01), 3) < r) continue;

    setC(g, x, y, [
      constrain(c[0] - 2, 0, 255),
      constrain(c[1] - 1, 0, 255),
      constrain(c[2] - n * 2, 0, 255),
      255,
    ]);
    if (pow(n, 3) < r) continue;

    if (c[0] > 150) {
      if (cl[0] == 0) setC(g, x - 1, y, [255, 200, 200, 255]);
      if (cr[0] == 0) setC(g, x + 1, y, [255, 200, 200, 255]);
      if (ct[0] == 0) setC(g, x, y - 1, [255, 200, 200, 255]);
      if (cb[0] == 0) setC(g, x, y + 1, [255, 200, 200, 255]);
    } else {
      //nothing
    }
  }
  // for (let i = 0; i < 128 * 10; i++) {
  //   const x = floor(random(128));
  //   const y = floor(random(128));
  //   const c = getC(g, x, y);
  //   const c2 = getC(g, x - 1, y);
  //   const c3 = c[0] < c2[0] ? c : c2;

  //   setC(g, x, y, c3);
  //   setC(g, x - 1, y, c3);
  // }

  g.updatePixels();

  //   g.fill(0);
  //   g.stroke(255, 0, 0);
  //   g.rect(random(g.width), random(g.height), 2, 2);

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
