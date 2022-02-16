// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(512, 512);
  console.log(noise(1), noise(2), noise(3));
  console.log(noise(-1), noise(-2), noise(-3)); // same
}

function draw() {
  background("gray");
}
