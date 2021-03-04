// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

// inspired by Blue Ridge Falls, Bob Ross, 1994
// https://static01.nyt.com/images/2019/07/13/arts/bob-ross-oak_blue-ridge-falls/bob-ross-oak_blue-ridge-falls-superJumbo-v2.jpg?quality=90&auto=webp

let landscape;

function setup() {
  createCanvas(600, 600);
  landscape = createImage(128, 128);
  landscape.loadPixels();

  drawSky();

  drawMountain(color("#179"), color("#297"), 0, landscape.height * 0.5);
  drawMountain(
    color("#133"),
    color("#297"),
    landscape.height * 0.25,
    landscape.height * 0.5,
    2
  );

  drawTrees();

  landscape.updatePixels();
  noiseDetail(1);
}

function drawSky() {
  const fromColor = color("#0cf");
  const toColor = color("#eef");

  for (let y = 0; y < landscape.width; y++) {
    for (let x = 0; x < landscape.height; x++) {
      const id = y * landscape.width + x;
      let n = id / (landscape.width * landscape.height);
      n += noise(n * 2000, 0) * 0.5;
      n -= noise(n * 20, 1) * 0.5;
      n = constrain(n, 0, 1);
      n = pow(n, 0.25);

      //   const c = lerpColor(fromColor, toColor, n);

      const c = noise(x * 0.1, y) < n ? fromColor : toColor;
      landscape.set(x, y, c);
    }
  }
}

function drawMountain(fromColor, toColor, t, h, seed = 0) {
  for (let y = 0; y < landscape.width; y++) {
    for (let x = 0; x < landscape.height; x++) {
      const mountain_height = noise(x * 0.01, seed) * h;
      const chance = map(y - mountain_height, -6, 6, 0, 1);
      if (noise(x, y) > chance) continue;
      const dither = map(noise(x * 0.04, y * 0.03, seed), 0.3, 0.5, 0, 1);
      const c = noise(x, y, seed) < dither ? fromColor : toColor;

      landscape.set(x, t + y, c);
    }
  }
}

function drawTrees() {
  for (let id = 0; id < 10; id++) {
    const x = random(landscape.width);
    const y = random(landscape.height * 0.5, landscape.height * 1.5);
    const h = max(random(0, y), random(0, y));
    const lean = random(-5, 5);

    // darks
    for (let yy = 0; yy < h; yy++) {
      const w = map(yy, 0, h, h * 0.45, 0) * noise(yy * 0.3);
      const l = map(yy, 0, h, 0, lean);
      for (let xx = -w; xx < w; xx++) {
        landscape.set(x + xx + l, y - yy, color("black"));
      }
    }

    // trunk
    for (let yy = 0; yy < h; yy++) {
      const l = map(yy, 0, h, 0, lean);
      landscape.set(x + l, y - yy, color("#af5"));
      landscape.set(x + l + 1, y - yy, color("black"));
    }

    // lights
    for (let yy = 0; yy < h; yy++) {
      const w = map(yy, 0, h, h * 0.45, 0) * noise(yy * 0.3);
      const l = map(yy, 0, h, 0, lean);
      for (let xx = -w; xx < w; xx++) {
        const dither = noise(yy * 0.1);
        let c = color("#0f0");
        if (noise(xx, yy) < dither) continue;
        if (noise(xx, yy) < dither + 0.2) c = color("#333");
        landscape.set(x + xx + l, y - yy, c);
      }
    }
  }
}

function setRectC(img, l, t, w, h, c) {
  for (let y = t; y < t + h; y++) {
    for (let x = l; x < l + w; x++) {
      img.set(x, y, c);
    }
  }
}
function draw() {
  noSmooth();
  image(landscape, 0, 0, 600, 600);
}

function getC(img, x, y) {
  // wrap
  x = floor(x) % img.width;
  if (x < 0) x += img.width;
  y = floor(y) % img.height;
  if (y < 0) y += img.width;

  // clamp
  //   x = constrain(floor(x), 0, img.width);
  //   y = constrain(floor(y), 0, img.height);

  const i = (y * img.width + x) * 4;
  return [
    img.pixels[i + 0],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function setC(img, x, y, c) {
  // wrap
  x = floor(x) % img.width;
  if (x < 0) x += img.width;
  y = floor(y) % img.height;
  if (y < 0) y += img.width;

  // clamp
  //   x = constrain(floor(x), 0, img.width);
  //   y = constrain(floor(y), 0, img.height);

  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = c[0];
  img.pixels[i + 1] = c[1];
  img.pixels[i + 2] = c[2];
  img.pixels[i + 3] = c[3];
}
