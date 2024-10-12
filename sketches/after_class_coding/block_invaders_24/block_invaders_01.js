// module

import { Controls } from "./controls.js";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.id = "block-invaders";
canvas.width = 256;
canvas.height = 256;
document.body.appendChild(canvas);

const styles = document.createElement("style");
styles.textContent = `
  #block-invaders {
    border: none;
    width: 1024px;
    height: 1024px;
    image-rendering: pixelated;
    border-radius: 8px;
  }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: #111;
 }
`;
document.head.appendChild(styles);

function onFrame(t) {
  step();
  draw();

  window.requestAnimationFrame(onFrame);
}

setup();
onFrame();

function setup() {}

function step() {}

function draw() {
  console.log("Hello, Canvas");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
