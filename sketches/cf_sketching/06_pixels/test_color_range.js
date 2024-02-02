// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  pixelDensity(1);
  createCanvas(256, 256);

  background(0);
  noLoop();
  noStroke();
}

function draw() {
  let c;
  c = color(255, 0, 0);
  set(0, 0, c);
  updatePixels();
  console.log(red(c), get(0, 0)[0]); // 255 255

  c = color(254.9, 0, 0);
  set(0, 0, c);
  updatePixels();
  console.log(red(c), get(0, 0)[0]); // 254.9 255 (rounds up)

  c = color(254.4, 0, 0);
  set(0, 0, c);
  updatePixels();
  console.log(red(c), get(0, 0)[0]); // 254.4 254 (rounds down)

  c = color(255.1, 0, 0);
  set(0, 0, c);
  updatePixels();
  console.log(red(c), get(0, 0)[0]); // 255 255 (constrained)

  // randomly color each pixel a shade of gray
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      c = color(random(255));
      // ^ oops! pure white and pure black happen half as often as the others
      // c = color(floor(random(256)));
      // ^ correct! each value happens equally often
      set(x, y, c);
    }
  }
  updatePixels();

  // create an array of 256 0s
  const colorCounts = new Array(256).fill(0);

  // count the number of pixels of each color (check red component)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      c = get(x, y);
      const index = red(c);
      if (!colorCounts[index]) {
        colorCounts[index] = 0;
      }
      colorCounts[index]++;
    }
  }
  console.log(`0: ${colorCounts[0]}`); // ~128 // less often!
  console.log(`1: ${colorCounts[1]}`); // ~256
  console.log(`2: ${colorCounts[2]}`); // ~256
  console.log(`3: ${colorCounts[3]}`); // ~256
  console.log(`252: ${colorCounts[252]}`); // ~256
  console.log(`253: ${colorCounts[253]}`); // ~256
  console.log(`254: ${colorCounts[254]}`); // ~256
  console.log(`255: ${colorCounts[255]}`); // ~128 // less often!
}
