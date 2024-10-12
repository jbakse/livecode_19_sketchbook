// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";

const g = new Graphics(256, 256);

function onFrame(t) {
  step();
  draw();

  window.requestAnimationFrame(onFrame);
}

setup();
onFrame();

function setup() {
  console.log(g.width); // This will log 256
}

function step() {}

function draw() {
  console.log("Hello, Canvas");
  g.background("black");
}
