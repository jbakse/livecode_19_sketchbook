// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";

const controls = new Controls();
const graphics = new Graphics(256, 256);
const images = {};

const grayscaleEffect = `
    vec4 effect(vec4 color) {
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      return vec4(vec3(gray), color.a);
    }
  `;

const retroEffect = `
    vec4 effect(vec4 color) {
      
    }
  `;

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

function setup() {}

function step() {}

function draw() {
  const t = performance.now() / 1000;
  graphics.background(100);
  graphics.image(images.test_pattern, [10 + Math.sin(t) * 20, 10], {
    tint: "red",
  });
  graphics.image(images.test_pattern, [80, 10], { tint: "blue" });
  graphics.image(images.test_pattern, [150, 10]); // No tint

  // Apply a simple grayscale effect
  graphics.effect(retroEffect);
}
