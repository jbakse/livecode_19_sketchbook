// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const COLS = 9;
const ROWS = 9;
const SIZE = 48;

const grid = array2D(COLS, ROWS, false);

function setup() {
  createCanvas(512, 512);
  frameRate(60);
  colorMode(HSB, 1);

  grid[5][5] = new Bit();
  let bitCount = 1;
  while (bitCount < 52) {
    const x = randomInt(COLS);
    const y = min(randomInt(ROWS), randomInt(ROWS), randomInt(ROWS));

    if (!cellOccupied(x, y) && neighborOccupied(x, y, grid)) {
      grid[x][y] = new Bit();
      bitCount++;
    }
  }
}

function draw() {
  background(0.1);
  fill(0.5, 0.9, 0.9);

  translate(33, 33);
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (!grid[col][row]) continue;
      const x = col * SIZE;
      const y = row * SIZE;
      fill(grid[col][row].color);
      rect(x, y, SIZE - 2, SIZE - 2);
    }
  }
}

function cellOccupied(x, y) {
  x = constrain(x, 0, COLS - 1);
  y = constrain(y, 0, ROWS - 1);
  return grid[x][y];
}

function neighborOccupied(x, y) {
  if (cellOccupied(x - 1, y)) return true;
  if (cellOccupied(x + 1, y)) return true;
  if (cellOccupied(x, y - 1)) return true;
  if (cellOccupied(x, y + 1)) return true;
  return false;
}

class Bit {
  constructor() {
    this.color = color(randomInt(5) / 5, 0.5, 1);
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

function randomInt(a, b) {
  return floor(random(a, b));
}
