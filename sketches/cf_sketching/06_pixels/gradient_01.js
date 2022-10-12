// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let myImage;

function setup() {
  createCanvas(512, 512);
  myImage = new p5.Image(16, 16);
  angleMode(DEGREES);
}

function draw() {
  background("gray");
  noSmooth();
  myImage.loadPixels();
  for (let y = 0; y < myImage.height; y++) {
    for (let x = 0; x < myImage.width; x++) {
      let x2 = x;
      let y2 = y;

      // translate to center, to move the origin for rotation in next step
      x2 -= 8;
      y2 -= 8;

      // rotate
      [x2, y2] = rotatePoint(x2, y2, map(millis(), 0, 10000, 0, 360));

      // translate back
      x2 += 8;
      y2 += 8;

      // calcuate index based on the actual x and y
      const index = (x + y * myImage.width) * 4;

      // but color it based on our rotated x and y
      myImage.pixels[index] = map(x2, 0, myImage.width, 0, 255);
      myImage.pixels[index + 1] = map(y2, 0, myImage.height, 0, 255);
      myImage.pixels[index + 2] = 0;
      myImage.pixels[index + 3] = 255;
    }
  }
  myImage.updatePixels();
  image(myImage, 32, 32, width - 64, height - 64);
}

// rotates a point `x, y` around the origin (0, 0) by `a` degrees
// returns the new x and y is a 2-element array
function rotatePoint(x, y, a) {
  const x2 = x * cos(a) - y * sin(a);
  const y2 = x * sin(a) + y * cos(a);
  return [x2, y2];
}
