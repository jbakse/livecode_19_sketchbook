// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/p5.min.js

let mainImage;

let bluePalette;

const W = 320;
const H = 240;
function setup() {
  const c = createCanvas(W, H).canvas;
  c.style.width = `${W * 4}px`;
  c.style.height = `${H * 4}px`;
  c.style.imageRendering = "pixelated";
  mainImage = createImage(320, 240);
  noiseDetail(4, 0.5);
  noLoop();

  bluePalette = [
    buildPalette([55, 55, 75, 255], [200, 220, 255, 255], 4),
    buildPalette([200, 220, 255, 255], [245, 250, 255, 255], 3),
  ].flat();
}

function draw() {
  background("black");

  mainImage.loadPixels();

  let x = 180; // randomInt(W * 0.25, W * 0.75);
  let y = 10; // randomInt(H * -0.25, H * 0.25);

  for (let i = 0; i < 200; i++) {
    y += noiseInt(i * 0.3, 0, 0, 1, 2);
    x += noiseInt(i * 0.3, 0, 1, -1, 2);

    // ridge
    setPixel(mainImage, x, y, bluePalette[3]);

    let bump = 0;
    for (let ii = 0; ii < 200; ii++) {
      bump += noiseInt(ii * 0.3, 0, 2, -1, 2);
      // left
      const bright = noiseInt(
        //
        i * 0.2,
        ii * 0.1,
        0,
        4,
        7
      );

      setPixel(mainImage, x - ii, y + ii + bump, bluePalette[bright]);
      setPixel(mainImage, x - ii, y + ii + 1 + bump, bluePalette[bright]);
      setPixel(mainImage, x - ii, y + ii + 2 + bump, bluePalette[bright]);
    }

    bump = 0;
    for (let ii = 0; ii < 200; ii++) {
      bump += noiseInt(ii * 0.3, 0, 2, -1, 2);
      // right
      const dark = noiseInt(
        //
        i * 0.2,
        ii * 0.1,
        0,
        0,
        3
      );
      setPixel(mainImage, x + ii, y + ii + bump, bluePalette[dark]);
      setPixel(mainImage, x + ii, y + ii + 1 + bump, bluePalette[dark]);
      setPixel(mainImage, x + ii, y + ii + 2 + bump, bluePalette[dark]);
    }
  }

  mainImage.updatePixels();

  noSmooth();
  image(mainImage, 0, 0, width, height);
}

// math utils

function buildPalette(a, b, steps) {
  const palette = [];
  for (let i = 0; i < steps; i++) {
    palette.push(blendColor(a, b, i / (steps - 1)));
  }
  return palette;
}

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
  return floor(map(noise(x, y, z), 0, 0.5, a, b));
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
  return [max(a[0], b[0]), max(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])];
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
  if (key === "S") {
    save("canvas.jpg");
  }
}
