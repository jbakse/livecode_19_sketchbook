// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.js

/* exported setup draw */

let c, c2;
function setup() {
  createCanvas(512, 512);

  c = color(255, 255, 0);
  console.log(c);

  colorMode(HSB, 1);

  c2 = color(0.1, 1, 1);
  console.log(c2);

  console.log(c2 instanceof p5.Color);
  console.log(typeof c2);

  c2 = JSON.parse(JSON.stringify(c2));
  console.log(c2);
}

function draw() {
  background(color(c2));

  noLoop();
}
