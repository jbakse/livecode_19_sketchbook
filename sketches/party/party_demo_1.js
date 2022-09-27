// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload mousePressed */
/* global partyConnect partyLoadShared */

let shared;

function preload() {
  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "jb_party_demo_9_13",
    "main"
  );

  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(400, 400);

  shared.grid = [];

  for (let col = 0; col < 10; col++) {
    shared.grid[col] = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
  }
}

function mousePressed() {
  // figure out what row + col are being clicked
  let col = floor(mouseX / 40);
  let row = floor(mouseY / 40);
  col = constrain(col, 0, 9);
  row = constrain(row, 0, 9);

  shared.grid[col][row] = !shared.grid[col][row];
}

function draw() {
  background("black");
  fill("red");
  noStroke();

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const x = col * 40 + 1;
      const y = row * 40 + 1;
      if (shared.grid[col][row]) {
        rect(x, y, 40 - 2, 40 - 2);
      }
    }
  }
}
