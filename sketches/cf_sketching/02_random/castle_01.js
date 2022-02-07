// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// draws a castle

/* exported setup draw */

const BLOCK = 12;
const COLS = 16;
const ROWS = 16;
const blocks = new Array(COLS).fill(0).map(() => new Array(ROWS).fill(0));
const WALL_COLOR = "#aaa";

console.log(blocks);

function setup() {
  const c = createCanvas(COLS * BLOCK, ROWS * BLOCK);
  c.style("width", "100%");
  c.style("height", "auto");
  c.style("image-rendering", "pixelated");
  noSmooth();
  noLoop();
}

// eslint-disable-next-line
function draw() {
  background("black");

  // stack blocks
  for (let i = 0; i < 64; i++) {
    const col = floor(middleRandom(0, 16, 2)); // the middle bias really shows
    for (let row = ROWS - 1; row >= 2; row--) {
      if (blocks[col][row] === 0) {
        blocks[col][row] = 1;
        break;
      }
    }
  }

  // drop clingers
  for (let i = 0; i < 8; i++) {
    const col = floor(middleRandom(1, 15, 1));
    for (let row = 0; row < ROWS - 1; row++) {
      const down = blocks[col][row + 1] === 1;
      const left = blocks[col - 1][row] === 1;
      const right = blocks[col + 1][row] === 1;
      const down_left = blocks[col - 1][row + 1] === 1;
      const down_right = blocks[col + 1][row + 1] === 1;
      if (((left && down_left) || (right && down_right)) && !down) {
        blocks[col][row] = 1;
        break;
      }
    }
  }

  // draw blocks
  noStroke();
  fill(WALL_COLOR);
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const x = col * BLOCK;
      const y = row * BLOCK;
      if (blocks[col][row] === 1) {
        rect(x, y, BLOCK, BLOCK);
      }
    }
  }

  buttressIt();
  crenelateIt();

  // windows

  for (let i = 0; i < 256; i++) {
    const row = floor(random(0, ROWS));
    const col = floor(random(0, COLS));
    if (blocks[col][row] === 1) {
      // brick
      //   for (let b = 0; b < 4; b++) {
      //     fill(random(["#777", "#999", "#ccc"]));
      //     const c = randomInt(0, 3);
      //     const r = randomInt(0, 6);
      //     const stagger = (r % 2) * 2;
      //     rect(col * BLOCK + c * 4 + stagger, row * BLOCK + r * 2, 4, 2);
      //   }
      // window
      fill("black");
      rect(
        col * BLOCK + 5 + randomInt(-3, 3),
        row * BLOCK + 4,
        BLOCK - 10,
        BLOCK - 8
      );
    }
  }

  shadeIt();
}

function buttressIt() {
  fill(WALL_COLOR);
  for (let i = 0; i < 2; i++) {
    for (let y = height - 2; y > 1; y--) {
      // sweep left to right looking for left edge
      for (let x = 2; x < width - 2; x++) {
        const here = brightness(get(x, y));
        const up = brightness(get(x, y - 1));
        const right = brightness(get(x + 1, y));
        if (here === 0 && up > 0 && right > 0) {
          rect(x, y, 1, 1);
        }
      }
      // sweep right to left looking for right edge
      for (let x = width - 3; x > 2; x--) {
        const here = brightness(get(x, y));
        const up = brightness(get(x, y - 1));
        const left = brightness(get(x - 1, y));
        if (here === 0 && up > 0 && left > 0) {
          rect(x, y, 1, 1);
        }
      }
    }
  }
}

function crenelateIt() {
  fill(WALL_COLOR);
  for (let i = 0; i < 2; i++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 2; x < width - 2; x++) {
        const here = brightness(get(x, y));
        const down = brightness(get(x, y + 1));
        const crenelate_on = (x + 1) % 4 < 2;
        if (here === 0 && down > 0 && crenelate_on) {
          rect(x, y, 1, 1);
        }
      }
    }
  }
}
function shadeIt() {
  // shade
  // loop over x and y
  for (let y = 1; y < height - 1; y++) {
    for (let x = 2; x < width - 2; x++) {
      const here = brightness(get(x, y));
      const left = brightness(get(x - 1, y));
      const right = brightness(get(x + 1, y));
      const up = brightness(get(x, y - 1));
      const down = brightness(get(x, y + 1));

      if (here > 0 && up === 0) {
        fill(255, 100);
        rect(x, y, 1, 1);
      }

      if (here > 0 && right === 0) {
        fill(255, 50);
        rect(x, y, 1, 1);
      }

      if (here > 0 && left === 0) {
        fill(0, 50);
        rect(x, y, 1, 1);
      }

      if (here > 0 && down === 0) {
        fill(0, 100);
        rect(x, y, 1, 1);
      }
    }
  }
}

function middleRandom(min, max, rolls) {
  let v = 0;
  for (let roll = 0; roll < rolls; roll++) {
    v += random(min, max);
  }
  return v / rolls;
}

function roundTo(v, n) {
  return Math.round(v / n) * n;
}

function randomInt(min, max) {
  return floor(random(min, max));
}
