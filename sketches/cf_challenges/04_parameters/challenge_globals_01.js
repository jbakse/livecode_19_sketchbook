// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js

/* exported setup draw */

// Number of squares to draw
const SQUARE_COUNT = 50;
const STROKE_WEIGHT = 4;
const SMALL_SIZE = 10;
const LARGE_SIZE = 50;
const LARGE_CHANCE = 0.1; // range 0 to 1

function setup() {
  createCanvas(512, 512);
  fill(100);
  noStroke();
  rectMode(CENTER);
}

function draw() {
  background(50);
  fill(200, 100, 100);
  stroke("white");
  strokeWeight(STROKE_WEIGHT);
  for (let i = 0; i < SQUARE_COUNT; i++) {
    const s = random() < LARGE_CHANCE ? LARGE_SIZE : SMALL_SIZE;
    // the above line is shorthand for:
    // let s;
    // if (random() < LARGE_CHANCE) {
    //   s = LARGE_SIZE;
    // } else {
    //   s = SMALL_SIZE;
    // }
    // the shorthand has two advantages:
    // it is shorter
    // it allows s to be declared const

    rect(random(0, width), random(0, height), s, s);
  }
  noLoop();
}
