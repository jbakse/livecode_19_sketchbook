// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";

const controls = new Controls();
const graphics = new Graphics(256, 256);

function onFrame(t) {
  step();
  draw();

  window.requestAnimationFrame(onFrame);
}

await preload();
setup();
onFrame();

async function preload() {
  await graphics.loadImage("ghost", sketch_directory + "images/ghost.png");
}

function setup() {
  console.log(graphics.width); // This will log 256
}

function step() {}

function draw() {
  graphics.background(255, 255, 255);
  graphics.image("ghost", 10, 10, 32, 32, "red");
}
