// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const margin = 0.2;
const margin2 = 0.1;
const noiseFreq = 0.005;
const noiseAmp = 200;

let srcImage;
let scratchImage;

function setup() {
  noiseDetail(2);
  createCanvas(500, 500);
  // creates a whole new renderer
  // you can draw with fill/rect/ect into this
  // AND
  // you can manipulate its pixels
  pixelDensity(1);
  srcImage = createGraphics(1000, 1000);
  scratchImage = createGraphics(1000, 1000);
  noiseDetail(2, 0.5);
  noLoop();
  noiseDetail(1);
}

function draw() {
  background(150, 0, 0);

  // draw the source image
  srcImage.noSmooth();
  srcImage.rectMode(CORNERS);
  srcImage.background(0);
  srcImage.fill(255);
  const marginPixels = margin * srcImage.width;
  const margin2Pixels = margin2 * srcImage.width;
  srcImage.rect(
    marginPixels,
    marginPixels,
    srcImage.width - marginPixels,
    srcImage.width - marginPixels
  );
  srcImage.fill(0);
  srcImage.rect(
    marginPixels + margin2Pixels,
    marginPixels + margin2Pixels,
    srcImage.width - marginPixels - margin2Pixels,
    srcImage.width - marginPixels - margin2Pixels
  );

  // load the pixels
  srcImage.loadPixels();
  scratchImage.loadPixels();

  // walk through source image process it per-pixel to create destination imge
  for (let y = 0; y < srcImage.width; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      //   const fuzz = y / 10;
      //   const offsetX = noiseInt(x * noiseFreq, y * noiseFreq, 0, -fuzz, fuzz);
      //   const offsetY = noiseInt(x * noiseFreq, y * noiseFreq, 1, -fuzz, fuzz);

      const fuzz =
        noise(x * noiseFreq, y * noiseFreq, frameCount * 0.1) * noiseAmp;
      const offsetX = randomInt(-fuzz, fuzz);
      const offsetY = randomInt(-fuzz, fuzz);

      const sample = getPixel(srcImage, x + offsetX, y + offsetY);
      setPixel(scratchImage, x, y, sample);
    }
  }

  // done with the pixeling
  srcImage.updatePixels();
  scratchImage.updatePixels();

  // draw output
  noSmooth();
  image(scratchImage, 0, 0, width, height);
}

function randomInt(a, b) {
  return floor(random(a, b));
}

// function noiseInt(x, y, z, a, b) {
//   noiseDetail(1);
//   return floor(map(noise(x, y, z), 0, .5, a, b));
// }

function clamp(value, minimum, maximum) {
  if (value < minimum) return minimum;
  if (value > maximum) return maximum;
  return value;
}

function setPixel(img, x, y, color) {
  const clampX = clamp(x, 0, img.width - 1);
  const clampY = clamp(y, 0, img.height - 1);
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
  const clampX = clamp(x, 0, img.width - 1);
  const clampY = clamp(y, 0, img.height - 1);
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

function keyPressed() {
  if (key === "S") {
    save("canvas.jpg");
  }
}
