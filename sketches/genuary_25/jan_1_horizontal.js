/* global sketch_directory */
/* eslint-disable prefer-template */
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require module /sketches/grabber/out.js

let font;

function preload() {
  font = loadFont(
    sketch_directory + "/Inconsolata/static/Inconsolata_Expanded-ExtraLight.ttf"
  );
}
function setup() {
  pixelDensity(2);
  createCanvas(1080 * 0.5, 1920 * 0.5);
  textFont(font);
  noLoop();
}

function draw() {
  background("#ff9900");

  noFill();
  blendMode(DIFFERENCE);
  for (const y of range(30, height, 30)) {
    strokeWeight(40);
    stroke(random([150, 200, 225, 250]));
    line(30, y + random(-5, 5), width - 30, y + random(-5, 5));
  }

  drawOverlay();
}

function range(min, max, step = 1) {
  const a = [];
  for (let i = min; i < max; i += step) {
    a.push(i);
  }
  return a;
}

function drawOverlay() {
  push();
  blendMode(BLEND);
  textSize(24);
  let y = height - 125;
  const x = 30;
  blockText("#GENUARY2025 #P5", x, (y += 25));
  blockText("DAY 1", x, (y += 25));
  //   blockText("Vertical or horizontal", 25, (y += 25));
  //   blockText("lines only.", 25, (y += 25));
  blockText("VERTICAL OR HORIZONTAL", x, (y += 25));
  blockText("LINES ONLY", x, (y += 25));
  pop();
}

function blockText(str, x, y, blockColor = "white", textColor = "black") {
  const padding = 5;
  push();
  noStroke();
  fill(blockColor);
  const bounds = font.textBounds(str, x, y);
  rect(x - padding, y - 24 + 4, bounds.w + padding * 3, 24);
  fill(textColor);
  textAlign(LEFT, BASELINE);
  text(str, x, y);
  pop();
}
