// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require ../sketches/p5party/p5.party.js

/* exported preload setup draw mouseReleased*/
/* globals partyConnect partyLoadShared */

const colors = ["white", "gray"];

let shared;
let editor_tile_index = 0;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "hello_party",
    "main"
  );
  shared = partyLoadShared("shared");
}
function setup() {
  createCanvas(600, 600);

  if (!shared.tiles) {
    shared.tiles = [];
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
    shared.tiles.push(array2D(8, 8, 0));
  }
  if (!shared.map) {
    shared.map = array2D(8, 8, 0);
  }
}

function draw() {
  background(0);

  // draw tile
  const editor_tile = shared.tiles[editor_tile_index];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      fill(colors[editor_tile[col][row]]);
      rect(col * 24, row * 24, 24, 24);
    }
  }

  // draw tile select
  for (let col = 0; col < 8; col++) {
    if (col === editor_tile_index) {
      fill("gray");
      rect(col * 24, 192, 24, 24);
    }
    fill("white");
    text(col, col * 24 + 8, 208);
  }

  // draw map

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      push();

      translate(col * 24 + 200, row * 24);

      const tile = shared.tiles[shared.map[col][row]];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          noStroke();
          fill(colors[tile[x][y]]);
          rect(x * 3, y * 3, 3, 3);
        }
      }
      noFill();
      stroke(0, 20);
      rect(0, 0, 24, 24);
      pop();
    }
  }
}

function mousePressed() {
  const editor_tile = shared.tiles[editor_tile_index];
  if (pointInRect([mouseX, mouseY], [0, 0, 192, 192])) {
    const row = floor(mouseY / 24);
    const col = floor(mouseX / 24);
    editor_tile[col][row] = (editor_tile[col][row] + 1) % colors.length;
  }
  if (pointInRect([mouseX, mouseY], [0, 192, 192, 24])) {
    const col = floor(mouseX / 24);
    editor_tile_index = col;
  }

  if (pointInRect([mouseX, mouseY], [200, 0, 192, 192])) {
    const row = floor(mouseY / 24);
    const col = floor((mouseX - 200) / 24);
    shared.map[col][row] = editor_tile_index;
  }
}

function pointInRect(p, r) {
  return (
    p[0] >= r[0] && p[0] < r[0] + r[2] && p[1] >= r[1] && p[1] < r[1] + r[3]
  );
}

function array2D(cols, rows, value) {
  const a = [];
  for (let col = 0; col < cols; col++) {
    a.push([]);
    for (let row = 0; row < rows; row++) {
      a[col][row] = value;
    }
  }
  return a;
}
