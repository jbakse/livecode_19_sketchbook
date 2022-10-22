import { gameStates, setGameState } from "./main.js";

export function enter() {
  // nothing
}

export function update() {
  // nothing
}

export function draw() {
  push();
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  translate(width / 2, height / 2);
  text("Title Screen", 0, 0);
  pop();
}

export function mousePressed() {
  setGameState(gameStates.play);
}

export function leave() {
  // nothing
}
