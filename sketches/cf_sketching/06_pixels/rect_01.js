// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  noiseDetail(2);
  pixelDensity(1);
  createCanvas(600, 600);

  background("black");
  noLoop();
}

function draw() {
  loadPixels();

  // sky
  prect(0, 0, 600, 300, color(25, 50, 125, 255), color(50, 100, 250, 255));

  // grass
  prect(0, 300, 600, 300, color(0, 100, 0, 255), color(0, 200, 100, 255));

  // house
  prect(
    300,
    200,
    200,
    200,
    color(255, 255, 100, 255),
    color(155, 155, 100, 255)
  );

  // scramble
  //   for (let i = 0; i < 10000; i++) {
  //     const x1 = randomInt(0, 600);
  //     const y1 = randomInt(0, 600);
  //     const c1 = getPixel(x1, y1);
  //     const x2 = randomInt(0, 600);
  //     const y2 = randomInt(0, 600);
  //     const c2 = getPixel(x2, y2);

  //     setPixel(x1, y1, c2);
  //     setPixel(x2, y2, c1);
  //   }

  scatter(100, 100000);
  scatter(4, 300000);

  updatePixels();
}

function scatter(distance = 10, times = 1000000) {
  for (let i = 0; i < times; i++) {
    const x1 = randomInt(0, 600);
    const y1 = randomInt(0, 600);
    const c1 = getPixel(x1, y1);
    const x2 = x1 + randomInt(-distance, distance);
    const y2 = y1 + randomInt(-distance, distance);
    const c2 = getPixel(x2, y2);

    setPixel(x1, y1, c2);
    setPixel(x2, y2, c1);
  }
}
function prect(l, t, w, h, c1, c2) {
  for (let y = t; y < t + h; y++) {
    for (let x = l; x < l + w; x++) {
      const c = lerpColor(c1, c2, random());
      setPixel(x, y, c.levels);
    }
  }
}

function randomInt(a, b) {
  return floor(random(a, b));
}

function noiseInt(x, y, z, a, b) {
  noiseDetail(1);
  return floor(map(noise(x, y, z), 0, 0.5, a, b));
}

function setPixel(x, y, color, img = { pixels, width, height }) {
  const clampX = constrain(x, 0, img.width - 1);
  const clampY = constrain(y, 0, img.height - 1);
  if (clampX !== x || clampY !== y) {
    return;
  }

  const i = (clampY * img.width + clampX) * 4;
  img.pixels[i] = color[0];
  img.pixels[i + 1] = color[1];
  img.pixels[i + 2] = color[2];
  img.pixels[i + 3] = color[3];
}

function getPixel(x, y, img = { pixels, width, height }) {
  const clampX = constrain(x, 0, img.width - 1);
  const clampY = constrain(y, 0, img.height - 1);
  //   if (clampX !== x || clampY !== y) {
  //     return [0, 0, 0, 0];
  //   }
  const i = (clampY * img.width + clampX) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}
