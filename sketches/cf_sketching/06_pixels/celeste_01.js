// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// sliders
let moldGens;
let moldChance;

// images
let srcImage;
let scratchImage;

// pixel color "enums"
const empty = 10;
const wall = 100;
const mold = 200;
const moldEdge = 255;

function setup() {
  noiseDetail(2);
  createCanvas(1500, 1500);

  noiseDetail(1);
  noLoop();

  pixelDensity(1);
  srcImage = createGraphics(150, 150);
  scratchImage = createGraphics(150, 150);

  moldGens = createSlider(0, 100, 10);
  moldGens.input(() => redraw());

  moldChance = createSlider(0, 100, 50);
  moldChance.input(() => redraw());
}

function draw() {
  background(150, 0, 0);

  // draw the source image
  drawMap(srcImage);

  // load the pixels
  srcImage.loadPixels();
  scratchImage.loadPixels();

  // grow mold
  for (let i = 0; i < moldGens.value(); i++) {
    moldEdges(
      srcImage,
      scratchImage,
      empty,
      [mold, mold, mold, 255],
      1,
      moldChance.value() / 100
    );
  }

  // outer mold
  moldEdges(
    srcImage,
    scratchImage,
    empty,
    [moldEdge, moldEdge, moldEdge, 255],
    1
  );

  // colorize
  for (let y = 0; y < srcImage.width; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      const p = getPixel(srcImage, x, y)[0];
      if (p === empty) {
        setPixel(srcImage, x, y, [40, 0, 40, 255]);
      } else if (p === wall) {
        setPixel(srcImage, x, y, [45, 20, 0, 255]);
      } else if (p === mold) {
        if (random() < 0.8) {
          setPixel(srcImage, x, y, [20, 20, 20, 255]);
        } else {
          setPixel(srcImage, x, y, [50, 50, 150, 255]);
        }
      } else if (p === moldEdge) {
        setPixel(srcImage, x, y, [255, 0, 0, 255]);
      }
    }
  }
  srcImage.updatePixels();

  // stroke blocks
  moldEdges(srcImage, scratchImage, 45, [100, 60, 20, 255]);
  moldEdges(srcImage, scratchImage, 45, [100, 60, 20, 255]);
  moldEdges(srcImage, scratchImage, 45, [100, 60, 20, 255]);

  // fuzzy stroke room
  moldEdges(srcImage, scratchImage, 40, [0, 0, 0, 255], 15, 0.5);
  moldEdges(srcImage, scratchImage, 40, [0, 0, 0, 255], 15, 0.5);
  moldEdges(srcImage, scratchImage, 40, [0, 0, 0, 255], 15, 0.5);

  // done with the pixeling
  srcImage.updatePixels();
  scratchImage.updatePixels();

  // draw output
  noSmooth();
  image(srcImage, 0, 0, width, height);
}

function moldEdges(src, scratch, emptyR, c, spread = 1, chance = 1) {
  for (let y = 0; y < src.width; y++) {
    for (let x = 0; x < src.width; x++) {
      const p = getPixel(src, x, y)[0];
      const l = getPixel(src, x - spread, y)[0];
      const r = getPixel(src, x + spread, y)[0];
      const t = getPixel(src, x, y - spread)[0];
      const b = getPixel(src, x, y + spread)[0];
      const isEdge = p !== l || p !== r || p !== t || p !== b;

      if (isEdge && p === emptyR && random() < chance) {
        setPixel(scratch, x, y, c);
      } else {
        setPixel(scratch, x, y, getPixel(src, x, y));
      }
    }
  }

  scratch.updatePixels();
  src.image(scratch, 0, 0);
  src.loadPixels();
}

function drawMap(img, res = 30) {
  const blockSize = img.width / res;
  img.background(empty);
  img.fill(wall);
  img.noStroke();
  for (let i = 0; i < 2 * res; i++) {
    const x = noiseInt(i, 1, 0, 1, res) * blockSize;
    const y = noiseInt(i, 2, 0, 1, res) * blockSize;
    img.rect(x, y, blockSize, blockSize);
  }
}

// function randomInt(a, b) {
//   return floor(random(a, b));
// }

function noiseInt(x, y, z, a, b) {
  noiseDetail(1);
  return floor(map(noise(x, y, z), 0, 0.5, a, b));
}

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
