/**
 * camera.js
 *
 * This module handles camera shake and the "chromatic abberation"
 * postprocessing effect.
 *
 * This module is loaded and managed by the main.js module.
 * And the gameStatePlay.js module uses the addShake() function.
 *
 */

let postprocessShader;
let shakeAmount = 0;

export function preload() {
  postprocessShader = loadShader("./shader.vert", "./shader.frag");
}

export function update() {
  shakeAmount *= 0.9;
}

export function addShake(amount) {
  shakeAmount += amount;
}

export function applyShake() {
  translate(width * 0.5, height * 0.5);

  translate(
    range_noise(-1, 1, frameCount * 0.8, 1) * shakeAmount,
    range_noise(-1, 1, frameCount * 0.8, 2) * shakeAmount
  );
  rotate(radians(range_noise(-0.2, 0.2, frameCount * 0.8, 3) * shakeAmount));
  translate(-width * 0.5, -height * 0.5);
}

export function postprocess(canvas) {
  push();
  shader(postprocessShader);
  postprocessShader.setUniform("tex0", canvas);
  postprocessShader.setUniform("resolution", [canvas.width, canvas.height]);
  postprocessShader.setUniform("time", millis() / 1000);
  postprocessShader.setUniform("shake", shakeAmount);
  fill("white");
  rect(0, 0, width, height);
  pop();
}

function range_noise(min, max, a = 0, b = 0, c = 0) {
  push();
  noiseDetail(2, 0.5); // this config has a .75 max
  pop();
  return map(noise(a, b, c), 0, 0.75, min, max);
}
