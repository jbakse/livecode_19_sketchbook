/**
 * main.js
 *
 * This is the entry point for the game. It doesn't do much itself, but rather
 * loads the other modules, sets things up, and coordinates the main game states.
 *
 * A major organizing prinicple of this code is that it is organized into
 * "gameStates". There is one gameState for the title screen and one for the
 * "play" state.
 *
 * Each gameState has a few methods and main is responsible for calling
 * these methods on the current gameState at the appropriate times.
 *
 * The methods are:
 *  enter - called when the game state is entered (optional)
 *  update - called every frame, game logic, no drawing
 *  draw - called every frame, should draw the scene, no game logic
 *  leave - called when the game state is left (optional)
 *  mousePressed - called when the mouse is pressed (optional)
 *  keyPressed - called when a key is pressed (optional)
 *  keyReleased - called when a key is released (optional)
 *
 * main.js provides a function called setGameState that gameStates can use to
 * change the current gameState.
 *
 * In additon main.js loads and manages the camera and the party modules.
 *
 */

import * as title from "./gameStateTitle.js";
import * as play from "./gameStatePlay.js";
import * as camera from "./camera.js";
import * as party from "./party.js";

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
  party.preload();
  fontDune = loadFont("./dune_rise/Dune_Rise.otf");
}

function setup() {
  // pixelDensity(1);
  canvas = createCanvas(config.width, config.height, WEBGL);
  noFill();
  noStroke();
  textFont(fontDune);
  preventDefaultKeys();

  party.setup();
  setGameState(gameStates.title);
}

function draw() {
  // update
  party.update();
  gameState.update();
  camera.update();

  // draw
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
