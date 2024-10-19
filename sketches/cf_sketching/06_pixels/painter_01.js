// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require /sketches/_libraries/webm-writer-0.3.0.js
// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require /sketches/_util/grabber_02.js

/* exported setup draw */

let info;
function setup() {
  noiseDetail(2);
  pixelDensity(1);
  createCanvas(400, 400);
  background("black");

  info = createDiv();
}

let mouseSpeed = 0;
function draw() {
  loadPixels();

  if (mouseIsPressed) {
    for (let i = 0; i < 100; i++) {
      drawStipples(
        lerp(pmouseX, mouseX, i / 100),
        lerp(pmouseY, mouseY, i / 100),
        mouseSpeed
      );
    }
  }

  times(1000000, process);

  scatter(10, 10000);

  updatePixels();

  // show framerate in info
  info.html(floor(frameRate()));
}

function process() {
  let x = randomInt(0, width);
  let y = randomInt(0, height - 1);
  let c = getPixel(x, y);
  let cDown = getPixel(x, y + 1);

  let cDarker = [
    //
    c[0] - 100,
    c[1] - 100,
    c[2] - 100,
    c[3],
  ];
  let cDownBrighter = [
    cDown[0] + 100,
    cDown[1] + 100,
    cDown[2] + 100,
    cDown[3],
  ];
  if (c[0] > cDown[0]) {
    setPixel(x, y, cDarker);
    setPixel(x, y + 1, cDownBrighter);
  }
}

function drawStipples(x, y, speed) {
  setPixel(
    //
    floor(randomGaussian(x, 10)),
    floor(randomGaussian(y, 10)),
    [255, 255, 255, 255]
  );
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

  const i = (clampY * img.width + clampX) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

function randomInt(a, b) {
  return floor(random(a, b));
}

function scatter(distance = 10, times = 1000000) {
  for (let i = 0; i < times; i++) {
    const x1 = randomInt(0, width);
    const y1 = randomInt(0, height);
    const c1 = getPixel(x1, y1);
    const x2 = x1 + randomInt(-distance, distance);
    const y2 = y1 + randomInt(-distance, distance);
    const c2 = getPixel(x2, y2);

    setPixel(x1, y1, c2);
    setPixel(x2, y2, c1);
  }
}
