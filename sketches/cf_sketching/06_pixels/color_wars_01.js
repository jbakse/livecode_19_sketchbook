// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

// This is adapted from the Color Wars cart by Munro Hoberman
// originally for pico-8 in 92 characters!
// n=128for i=0,4^7do
// pset(i%n,i/n,rnd(6)+7)end::_::x=rnd(n)y=rnd(n)circ(x,y,1,pget(x,y))goto _

// This Javascript version is about 1350 characters. 14x as big!

let war_image;

function setup() {
  createCanvas(600, 600);
  war_image = createImage(128, 128);
  war_image.loadPixels();
  for (let y = 0; y < war_image.width; y++) {
    for (let x = 0; x < war_image.height; x++) {
      const c = color(random(["brown", "pink", "green"]));
      war_image.set(x, y, c);
    }
  }
  war_image.updatePixels();
}

function draw() {
  war_image.loadPixels();
  for (let t = 0; t < 100; t++) {
    const x = random(war_image.width);
    const y = random(war_image.height);
    const rgba = getC(war_image, x, y);
    setC(war_image, x - 1, y, rgba);
    setC(war_image, x + 1, y, rgba);
    setC(war_image, x, y - 1, rgba);
    setC(war_image, x, y + 1, rgba);
  }
  war_image.updatePixels();

  noSmooth();
  image(war_image, 0, 0, 600, 600);
}

function getC(img, x, y) {
  // wrap
  x = floor(x) % img.width;
  if (x < 0) x += img.width;
  y = floor(y) % img.height;
  if (y < 0) y += img.width;

  // clamp
  //   x = constrain(floor(x), 0, img.width);
  //   y = constrain(floor(y), 0, img.height);

  const i = (y * img.width + x) * 4;
  return [
    img.pixels[i + 0],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function setC(img, x, y, c) {
  // wrap
  x = floor(x) % img.width;
  if (x < 0) x += img.width;
  y = floor(y) % img.height;
  if (y < 0) y += img.width;

  // clamp
  //   x = constrain(floor(x), 0, img.width);
  //   y = constrain(floor(y), 0, img.height);

  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = c[0];
  img.pixels[i + 1] = c[1];
  img.pixels[i + 2] = c[2];
  img.pixels[i + 3] = c[3];
}
