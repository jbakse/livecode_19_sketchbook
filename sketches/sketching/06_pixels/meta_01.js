// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

let g;

let circles = [];
function setup() {
  createCanvas(600, 600);
  g = createGraphics(128, 128);
  g.pixelDensity(1);

  for (let i = 0; i < 10; i++) {
    circles.push({
      x: random(100),
      y: random(100),
      r: 10,
      id: i,
    });
  }

  noiseDetail(8);
}

//https://www.cl.cam.ac.uk/teaching/1718/FGraphics/1.%20Ray%20Marching%20and%20Signed%20Distance%20Fields.pdf
function smin(a, b, k = 10) {
  const h = constrain(0.5 + (0.5 * (b - a)) / k, 0, 1);
  return lerp(b, a, h) - k * h * (1 - h);
}

function draw() {
  // g.background("gray");

  for (const a of circles) {
    a.x = noise(a.id, frameCount * 0.01, 0) * 100;
    a.y = noise(a.id, frameCount * 0.01, 1) * 100;
  }

  g.loadPixels();
  for (let i = 0; i < 128 * 32; i++) {
    const x = floor(random(64) + random(64));
    const y = floor(random(64) + random(64));
    // for (let y = 0; y < 128; y++) {
    // for (let x = 0; x < 128; x++) {
    // const xx = x + noise(x * 0.5, y * 0.5) * 3;
    // const yy = y + noise(x * 0.5, y * 0.5) * 3;
    let d = 100;
    for (const a of circles) {
      const c = dist(a.x, a.y, x, y) - a.r;

      d = smin(d, c, 5);
    }

    let i = (y * 128 + x) * 4;

    // const static = noise(x, y + frameCount);
    const static = random();
    // const static = 1;
    // const static = (x + y) % 2;

    const ripple = sin(d + frameCount * 0.1) * 0.5 + 0.5;
    g.pixels[i + 0] = map(d, -0, 10, ripple, 0, true) * 255;
    g.pixels[i + 1] = map(d, -10, 10, ripple, 0, true) * 255;
    g.pixels[i + 2] = map(d, -5, 10, ripple + static, 0, true) * 255;
    g.pixels[i + 3] = 255;
    // }
    // }
  }
  g.updatePixels();

  noSmooth();
  image(g, 0, 0, 600, 600);
}
