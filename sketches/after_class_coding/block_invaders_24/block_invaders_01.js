// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";
import { effects } from "./effects.js";

const controls = new Controls();
const graphics = new Graphics(256, 256);
const images = {};

await preload();
setup();

function onFrame(t) {
  step();
  draw();
  window.requestAnimationFrame(onFrame);
}
onFrame();

async function preload() {
  images.test_pattern = await graphics.loadImage(
    sketch_directory + "images/test_pattern.png"
  );
}

function setup() {}

function step() {}

function draw() {
  graphics.background(100);
  const x = 10 + Math.sin(performance.now() / 1000) * 20;
  graphics.drawImage(images.test_pattern, [x, 10], {
    tint: "red",
  });
  graphics.drawImage(images.test_pattern, [80, 10], { tint: "blue" });
  graphics.drawImage(images.test_pattern, [150, 10]); // No tint

  graphics.drawImage(images.test_pattern, [100, 100, 128, 128]);

  graphics.applyEffect(effects.retro);
}
