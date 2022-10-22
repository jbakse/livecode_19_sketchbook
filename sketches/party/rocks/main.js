import * as title from "./gameStateTitle.js";
import * as play from "./gameStatePlay.js";

export const config = {
  width: 600,
  height: 600,
};
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
}

function setup() {
  createCanvas(config.width, config.height);
  noFill();
  noStroke();
  preventDefaultKeys();

  setGameState(gameStates.title);
}

function draw() {
  gameState.update();
  gameState.draw();
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
