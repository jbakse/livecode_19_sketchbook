// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");
const buildings = [];
function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 1);
  buildings.push(makeBuilding(1));
  buildings.push(makeBuilding(2));
  buildings.push(makeBuilding(3));
  buildings.push(makeBuilding(4));
  buildings.push(makeBuilding(5));
  buildings.push(makeBuilding(6));
  buildings.push(makeBuilding(7));
  buildings.push(makeBuilding(8));
}

function draw() {
  background("#dcb");

  for (const b of buildings) {
    // faceBuilding(b);
    drawBuilding(b);
  }
}

function faceBuilding(b) {
  const indexOfMaxValue = a.reduce(
    (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
    0
  );
}

function makeBuilding(seed) {
  const x = n(0, 0, seed, 0, width);
  const y = n(0, 1, seed, 0, height);
  const r = n(0, 2, seed, 0, TWO_PI);
  const w = n(0, 2, seed, 0, 100);
  const h = n(0, 2, seed, 0, 100);

  return { x, y, r, w, h };
}

function drawBuilding(b) {
  push();
  translate(b.x, b.y);
  rotate(b.r);
  rectMode(CENTER);
  rect(0, 0, b.w, b.h);
  rect(0, b.h * 0.5, 10, 5);
  pop();
}

function n(x, y, z, min, max) {
  return map(noise(x, y, z), 0, 1, min, max);
}
