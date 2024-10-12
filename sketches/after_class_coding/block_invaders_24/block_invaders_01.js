// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";

const controls = new Controls();
const graphics = new Graphics(256, 256);
const images = {};

function onFrame(t) {
  step();
  draw();

  window.requestAnimationFrame(onFrame);
}

await preload();
setup();
onFrame();

async function preload() {
  images.ghost = await graphics.loadImage(
    sketch_directory + "images/ghost.png"
  );
}

function setup() {
  console.log(graphics.width); // This will log 256
}

function step() {}

function draw() {
  graphics.background(100);
  graphics.image(images.ghost, [10, 10, 64, 64], { smooth: false });  // Doubled the size, pixelated
}
