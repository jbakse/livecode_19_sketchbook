import * as title from "./gameStateTitle.js";
import * as play from "./gameStatePlay.js";
import * as camera from "./camera.js";
export const config = {
  width: 600,
  height: 600,
};

let fontDune;
let canvas;

// export module functions to window, so p5.js can find them
Object.assign(window, {
  preload,
  draw,
  setup,
  mousePressed,
  keyPressed,
  keyReleased,
});

function preload() {
  Object.values(gameStates).forEach((state) => state.preload?.());
  camera.preload();
  fontDune = loadFont("./dune_rise/Dune_Rise.otf");
}

function setup() {
  // pixelDensity(1);
  canvas = createCanvas(config.width, config.height, WEBGL);
  noFill();
  noStroke();
  textFont(fontDune);
  preventDefaultKeys();

  setGameState(gameStates.title);
}

function draw() {
  gameState.update();

  // move origin to top left
  translate(-width / 2, -height / 2);
  camera.applyShake();
  gameState.draw();
  camera.postprocess(canvas);
}

function mousePressed() {
  gameState.mousePressed?.();
}

function keyPressed() {
  gameState.keyPressed?.();
}

function keyReleased() {
  gameState.keyReleased?.();
}

// ///////////////////////////////////////////////////
// Game State Manager

let gameState;
export const gameStates = {
  title,
  play,
};
export function setGameState(newState) {
  // new state must be provided, and must have an update and draw function
  if (!newState || !newState.update || !newState.draw) {
    console.error("setGameState(newState): newState not not valid");
    return;
  }
  gameState?.leave?.();
  gameState = newState;
  gameState.enter?.();
}

// ///////////////////////////////////////////////////
// Utilities

function preventDefaultKeys() {
  // prevent browser from handling simple key presses
  // allow "meta" keys through
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.ctrlKey || e.metaKey) {
      return true;
    }
    e.preventDefault();
    return false;
  });
}
