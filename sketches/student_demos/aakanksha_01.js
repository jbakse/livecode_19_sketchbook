// Demo created with Aakanksha Aggarwal

// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const gridSize = 50;

function setup() {
  createCanvas(500, 500);
  noLoop();
}

function draw() {
  background(240, 240, 240);
  noStroke();
  fill(0, 0, 0, 100);

  //   for (let y = 0; y < height; y += gridSize) {
  //     for (let x = 0; x < width; x += gridSize) {
  //       rect(x, y, gridSize, gridSize);
  //     }
  //   }

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col += 2) {
      const x = col * gridSize;
      const y = row * gridSize;
      if (random(2) < 1) {
        fill(0, 0, 0, randomAlpha());
        patternRect(x, y, 2 * gridSize, gridSize, 8);
      }
    }
  }

  for (let row = 0; row < 10; row += 2) {
    for (let col = 0; col < 10; col++) {
      const x = col * gridSize;
      const y = row * gridSize;
      if (random(2) < 1) {
        fill(0, 0, 0, randomAlpha());
        patternRect(x, y, gridSize, 2 * gridSize, 8);
      }
    }
  }
}

function patternRect(x, y, width, height, numLines) {
  //   ellipseMode(CORNER);
  //   ellipse(x, y, width, height);
  stroke(255, 0, 0);
  if (random(2) < 1) {
    for (let i = 0; i < numLines; i++) {
      const x1 = x + (width / numLines) * i;
      const y1 = y + height;
      const x2 = x + width;
      const y2 = y + (height / numLines) * i;

      line(x1, y1, x2, y2);
    }
  }
  if (random(2) < 1) {
    for (let i = 0; i < numLines; i++) {
      const x1 = x + (width / numLines) * i;
      const y1 = y;
      const x2 = x;
      const y2 = y + (height / numLines) * i;

      line(x1, y1, x2, y2);
      // nothing
    }
  }
}

function randomAlpha() {
  if (random(2) < 1) {
    return 50;
  }
  return 100;
}
