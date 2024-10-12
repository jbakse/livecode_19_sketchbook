// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";
import { grayscaleEffect, retroEffect, boxBlurEffect } from "./effects.js";
import { EffectManager } from "./effects.js";

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
  images.test_pattern = await graphics.loadImage(
    sketch_directory + "images/test_pattern.png"
  );
}

function setup() {
  graphics.addEffect("grayscale", grayscaleEffect);
  graphics.addEffect("retro", retroEffect);
  graphics.addEffect("boxBlur", boxBlurEffect);
}

function step() {}

function draw() {
  graphics.background(100);
  graphics.image(images.test_pattern, [10 + Math.sin(performance.now() / 1000) * 20, 10], {
    tint: "red",
  });
  graphics.image(images.test_pattern, [80, 10], { tint: "blue" });
  graphics.image(images.test_pattern, [150, 10]); // No tint

  graphics.image(images.test_pattern, [100, 100, 128, 128]);

  graphics.effect("grayscale");
}
