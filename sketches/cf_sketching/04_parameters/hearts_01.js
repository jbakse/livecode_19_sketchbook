// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* globals Tweakpane */
/* exported setup draw preload*/
// this code is written in a data-oriented style, not unlike unity's Entity Compoenent System style

const params = {
  spawnDelay: 3,
  flowForce: 1,
  flowScale: 0.01,
  flowMutate: 0,
  floatForce: -1,
};
const pane = new Tweakpane.Pane();
pane.addInput(params, "spawnDelay", { min: 1, max: 100, step: 1 });
pane.addInput(params, "flowForce", { min: 0, max: 10, step: 0.1 });
pane.addInput(params, "flowScale", { min: 0, max: 0.1, step: 0.01 });
pane.addInput(params, "flowMutate", { min: 0, max: 0.1, step: 0.001 });
pane.addInput(params, "floatForce", { min: -5, max: 5, step: 0.1 });

const hearts = [];
let heartImage;

function preload() {
  heartImage = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAEZJREFUGFd9jcsNACAIQ9tB2MeR3YdBMBBq8CIXPi2vBICIiOwkOedatllqWO6Y8yOWoyuNf1GZwgmf+RRG2YXr+xVFmA8HZ9Mx/KGPMtcAAAAASUVORK5CYII="
  );
}
function setup() {
  createCanvas(512, 512);
  noiseDetail(2, 0.5);
}

function draw() {
  background("#600");
  noSmooth();

  if (frameCount % params.spawnDelay === 0) spawnHeart();

  hearts.forEach(stepHeart);
  hearts.forEach((heart) => {
    if (heart.y < -10) removeArrayItem(hearts, heart);
  });

  hearts.forEach(drawHeart);
}

function stepHeart(heart) {
  // float
  heart.y += params.floatForce;
  const t = frameCount * params.flowMutate;
  function n(x, y, z) {
    return (
      map(
        noise(x * params.flowScale, y * params.flowScale, z + t),
        0,
        0.75,
        -1,
        1
      ) * params.flowForce
    );
  }

  // flow
  heart.x += n(heart.x, heart.y, 10);
  heart.y += n(heart.x, heart.y, 20);
}

function spawnHeart() {
  hearts.push({
    x: random(width),
    y: height + 10,
  });
}

function drawHeart(heart) {
  push();
  translate(heart.x, heart.y);
  //   rotate(heart.r);
  image(heartImage, -10, -10, 21, 21);
  pop();
}

function removeArrayItem(a, item) {
  const index = a.indexOf(item);
  a.splice(index, 1);
}
