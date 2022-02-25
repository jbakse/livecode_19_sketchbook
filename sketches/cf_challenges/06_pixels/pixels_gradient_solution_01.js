// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0);

  img = createImage(10, 10);
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let c;

      // challenge start
      // c = color(y * 25, x * 25, 0);

      // Make a horizontal black-to-blue gradient.•
      // c = color(0, 0, x * 25);

      // Make a vertical green-to-black gradient.•
      // c = color(0, 255 - x * 25, 0);

      // Make a horizontal white-to-blue gradient.•
      // c = color(255, 255, 255 - x * 25);

      // Make a vertical rainbow gradient. Tip: colorMode()••
      // colorMode(HSB, 255);
      // c = color(y * 25, 255, 255);

      // Create an inset square with a gradient, surrounded by randomly-colored pixels.•••
      // c = color(random(255), random(255), random(255));
      // if (x > 0 && x < img.width - 1 && y > 0 && y < img.height - 1) {
      //   c = color(x * 25);
      // }

      // Make a radial gradient from black to red. Tip: dist()•••
      c = color(dist(x, y, img.width / 2, img.height / 2) * 25, 0, 0);

      // Create a diagonal gradient.•••
      const d = (x + y) / (img.width + img.height);
      c = color(d * 255, 0, 0);

      img.set(x, y, c);
    }
  }

  img.updatePixels();

  noSmooth();
  image(img, 0, 0, width, height);
  noLoop();
}
