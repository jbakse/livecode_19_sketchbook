// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require ../sketches/p5party/p5.party.js

/* exported preload setup draw mousePressed*/
/* globals partyConnect partyLoadShared */

const colors = ["white", "gray"];

let shared;
let editor_tile_index = 0;
let tile_editor;
let map_editor;

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

  tile_editor = new TileEditor(10, 10, 8 * 24, 9 * 24);
  tile_editor.setup();

  map_editor = new MapEditor(300, 10, 8 * 24, 8 * 24);
  map_editor.setup();
}

function draw() {
  background(0);
  tile_editor.draw();
  map_editor.draw();
}

function mousePressed() {}

class Zone {
  constructor(l, t, w, h) {
    this.bounds = new Rect(l, t, w, h);

    const canvas = document.getElementById("defaultCanvas0");
    canvas.addEventListener("mousedown", (e) => {
      if (!this.bounds.containsPoint({ x: e.offsetX, y: e.offsetY })) return;
      this.mousePressed(e.offsetX - this.bounds.l, e.offsetY - this.bounds.t);
    });
  }

  setup() {}

  step() {}

  draw() {}

  mousePressed(localX, localY) {}
}

class MapEditor extends Zone {
  step() {}

  draw() {
    push();
    translate(this.bounds.l, this.bounds.t);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        push();
        translate(col * 24, row * 24);
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
    pop();
  }

  mousePressed(localX, localY) {
    console.log(localX, localY);
    const row = floor(localY / 24);
    const col = floor(localX / 24);
    shared.map[col][row] = editor_tile_index;
  }
}

class TileEditor extends Zone {
  step() {}

  draw() {
    // draw tile
    push();
    translate(this.bounds.l, this.bounds.t);

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
    pop();
  }

  mousePressed(localX, localY) {
    console.log(localX, localY);
    const editor_tile = shared.tiles[editor_tile_index];
    if (localY < 192) {
      const row = floor(localY / 24);
      const col = floor(localX / 24);
      editor_tile[col][row] = (editor_tile[col][row] + 1) % colors.length;
    } else {
      const col = floor(localX / 24);
      editor_tile_index = col;
    }
  }
}

class Rect {
  constructor(l, t, w, h) {
    this.l = l;
    this.t = t;
    this.w = w;
    this.h = h;
  }
  containsPoint(p) {
    return (
      p.x >= this.l &&
      p.x < this.l + this.w &&
      p.y >= this.t &&
      p.y < this.t + this.h
    );
  }
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
