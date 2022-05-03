// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/p5.min.js

const starCount = 1000;
const backgroundNoise = 30;

let starImage;

function setup() {
  createCanvas(500, 500);
  starImage = createImage(500, 500);
  noiseDetail(2, .5);
  noLoop();
}

function draw() {
  background(50);

  starImage.loadPixels();

  // make a gradient base + some noise
  for (let y = 0; y < starImage.width; y++) {
    for (let x = 0; x < starImage.width; x++) {
      const c = map(y, 0, starImage.height, 0, 50) + randomInt(backgroundNoise);
      setPixel(starImage, x, y, [c, c, c, 255]);
    }
  }

  // make the sparkles
  for (let i = 0; i < starCount; i++) {
    const x = noiseInt(i, 0, 1, 0, starImage.width);
    const y = noiseInt(i, 0, 2, 0, starImage.height);
    const starR = noiseInt(x * .01, y * .06, 2, 0, 255);
    const starG = noiseInt(x * .01, y * .06, 3, 0, 255);
    const starB = noiseInt(x * .01, y * .06, 4, 0, 255);
    const color = [starR, starG, starB, 255];
    setPixel(starImage, x, y, color);
    setPixel(starImage, x, y - 1, color);
    setPixel(starImage, x + 1, y, color);
    setPixel(starImage, x, y + 1, color);
    setPixel(starImage, x - 1, y, color);
    setPixel(starImage, x, y - 2, color);
    setPixel(starImage, x + 2, y, color);
    setPixel(starImage, x, y + 2, color);
    setPixel(starImage, x - 2, y, color);
  }

  // make a blur/smear down
  for (let y = 1; y < starImage.height; y++) {
    for (let x = 1; x < starImage.width; x++) {
      const c1 = getPixel(starImage, x, y);
      const c2 = getPixel(starImage, x, y - 1);
      const blendC = blendColor(c1, c2, .9);
      const newC = lightestColor(c1, blendC);
      setPixel(starImage, x, y, newC);
    }
  }

  starImage.updatePixels();
  noSmooth();
  image(starImage, 0, 0, width, height);
}


// math utils

function clamp(value, minimum, maximum) {
  if (value < minimum) return minimum;
  if (value > maximum) return maximum;
  return value;
}

function randomInt(a, b) {
  return floor(random(a, b));
}

function noiseInt(x, y, z, a, b) {
  noiseDetail(1);
  return floor(map(noise(x, y, z), 0, .5, a, b));
}


// color utils

function blendColor(a, b, mix) {
  return [
    lerp(a[0], b[0], mix),
    lerp(a[1], b[1], mix),
    lerp(a[2], b[2], mix),
    lerp(a[3], b[3], mix),
  ];
}

function lightestColor(a, b) {
  return [
    max(a[0], b[0]),
    max(a[1], b[1]),
    max(a[2], b[2]),
    max(a[3], b[3]),
  ];
}

function setPixel(img, x, y, color) {
  const clampX = clamp(x, 0, img.width);
  const clampY = clamp(y, 0, img.height);
  if (clampX !== x || clampY !== y) {
    return;
  }

  const i = (clampY * img.width + clampX) * 4;
  img.pixels[i] = color[0];
  img.pixels[i + 1] = color[1];
  img.pixels[i + 2] = color[2];
  img.pixels[i + 3] = color[3];
}


function getPixel(img, x, y) {
  const clampX = clamp(x, 0, img.width);
  const clampY = clamp(y, 0, img.height);
  if (clampX !== x || clampY !== y) {
    return [0, 0, 0, 0];
  }
  const i = (clampY * img.width + clampX) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}


function keyPressed() {
  if (key === 'S') {
    save('canvas.jpg');
  }
}
