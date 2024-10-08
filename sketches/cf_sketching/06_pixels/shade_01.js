// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let info;
function setup() {
  noiseDetail(2);
  pixelDensity(1);
  createCanvas(360, 360);
  background("black");

  info = createDiv();
}

let mouseSpeed = 0;
function draw() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // try each of the lines below, one at a time!

      // setPixel(x, y, basicWhite(x, y));
      // setPixel(x, y, randomColor(x, y));
      // setPixel(x, y, verticalStripe(x, y));
      // setPixel(x, y, rg(x, y));
      // setPixel(x, y, rg(...polar(x, y)));
      setPixel(x, y, verticalStripe(...polar(x, y)));
      // setPixel(x, y, crazy(x, y));
      // setPixel(x, y, crazy(...polar(x, y)));
    }
  }

  // scatter(2, 100000);
  updatePixels();
  noLoop();
  // show framerate in info
  info.html(floor(frameRate()) + " [" + getPixel(mouseX, mouseY) + "]");
}

function basicWhite(x, y) {
  return [255, 255, 255, 255];
}

function randomColor(x, y) {
  return [random(255), random(255), random(255), 255];
}

function verticalStripe(x, y) {
  let c1 = [255, 255, 255, 255];
  let c2 = [0, 0, 0, 255];
  let stripeWidth = 10;
  let stripePosition = x % (stripeWidth * 2);
  if (stripePosition < stripeWidth) {
    return c1;
  } else {
    return c2;
  }
}

function rg(x, y) {
  return [x / 360 * 255, y / 360 * 255, 0, 255];
}

function crazy(x, y) {
  let x1 = x +
    noise(sin(x / 360 * TWO_PI * 4), sin(y / 360 * TWO_PI * 4), 1) * 100;
  let y1 = y +
    noise(sin(x / 360 * TWO_PI * 4), sin(y / 360 * TWO_PI * 4), 2) * 100;
  let r = map(x1 % 60, 0, 60, 0, 255);
  let g = map(sin(y1 * TWO_PI / 100), -1, 1, 0, 255);
  let b = map(y1 % 60, 0, 60, 0, 255);
  return [r, g, b, 255];
}

function polar(x, y) {
  let angle = degrees(atan2(y - height / 2, x - width / 2)) + 180;

  let distance = dist(width / 2, height / 2, x, y);
  return [angle, distance];
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
