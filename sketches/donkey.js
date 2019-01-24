"use strict";
console.log("hi");

let donkeyX = 0;
let donkeyY = 0;
let hay1X = 300;
let hay1Y = 100;
let hay2X = 100;
let hay2Y = 500;
let hay3X = 500;
let hay3Y = 500;

window.setup = function() {
  createCanvas(600, 600);
  background(50, 50, 50);
  fill(255);
  noStroke();
};

window.draw = function() {
  for (let i = 0; i < 10; i++) {
    stepScene();
    drawScene();
  }
};

function stepScene() {
  let r = floor(random(3));
  if (r === 0) {
    donkeyX = lerp(donkeyX, hay1X, 0.5);
    donkeyY = lerp(donkeyY, hay1Y, 0.5);
  } else if (r === 1) {
    donkeyX = lerp(donkeyX, hay2X, 0.5);
    donkeyY = lerp(donkeyY, hay2Y, 0.5);
  } else if (r === 2) {
    donkeyX = lerp(donkeyX, hay3X, 0.5);
    donkeyY = lerp(donkeyY, hay3Y, 0.5);
  }
}

function drawScene() {
  ellipse(donkeyX, donkeyY, 1, 1);
}
