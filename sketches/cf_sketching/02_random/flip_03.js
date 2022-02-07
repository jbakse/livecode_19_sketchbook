// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const cols = 32;
const rows = 32;
const col_width = 512 / cols;
const row_height = 512 / rows;

// this next line is ugly ugly. two uglies.
const data = new Array(cols)
  .fill(0)
  .map(() => new Array(rows).fill(0).map(() => new Array(3).fill(false)));

const worms = [
  { x: 16, y: 16, i: 0 },
  { x: 16, y: 16, i: 1 },
  { x: 16, y: 16, i: 2 },
];

function setup() {
  createCanvas(512, 512);
  angleMode(DEGREES);
}

function draw() {
  // worm it
  worms.forEach((worm) => {
    const dir = randomInt(4);
    worm.x += -cos((dir / 4) * 360);
    worm.y += -sin((dir / 4) * 360);
    worm.x = mod(worm.x, cols);
    worm.y = mod(worm.y, rows);
    data[worm.x][worm.y][worm.i] = dir;
  });

  // draw it
  blendMode(BLEND);
  background("black");
  blendMode(ADD);
  ellipseMode(CORNER);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * col_width;
      const y = row * row_height;

      noStroke();
      if (data[col][row][0] !== false) {
        fill("magenta");
        arc(x + 2, y + 2, col_width - 4, row_height - 4, 0, 180);
      }
      if (data[col][row][1] !== false) {
        fill("cyan");
        arc(x + 2, y + 2, col_width - 4, row_height - 4, 180, 360);
      }

      if (data[col][row][2] !== false) {
        fill("yellow");
        rect(x + 2, y + 2, col_width - 4, row_height - 4);
      }
    }
  }
}

function randomInt(min, max) {
  return floor(random(min, max));
}

function mod(a, b) {
  return ((a % b) + b) % b;
}
