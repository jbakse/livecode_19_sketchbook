// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0);

  img = createImage(50, 50);
  img.loadPixels();

  for (let i = 0; i < 250; i++) {
    let c = color(random(255), random(255), random(255));
    const x = random(1, 49);
    const y = random(1, 49);
    img.set(x, y, c);

    img.set(x, y - 1, c);
    img.set(x + 1, y, c);
    img.set(x, y + 1, c);
    img.set(x - 1, y, c);
  }

  img.updatePixels();

  noSmooth();
  image(img, 0, 0, width, height);
  noLoop();
}
