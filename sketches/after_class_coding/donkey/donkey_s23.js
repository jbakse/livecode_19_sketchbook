// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

console.log("hello donkey_s23.js");

const hayStacks = [
  { x: 400, y: 100 },
  { x: 100, y: 700 },
  { x: 700, y: 700 },
];
const donkey = { x: 400, y: 400 };

function setup() {
  createCanvas(800, 800);
  background(0);
  noStroke();
}

function draw() {
  // move donkey

  const targetHay = random(hayStacks);
  donkey.x = lerp(donkey.x, targetHay.x, 0.5);
  donkey.y = lerp(donkey.y, targetHay.y, 0.5);

  // draw donkey
  fill(255, 255, 255);
  ellipse(donkey.x, donkey.y, 5, 5);
}
