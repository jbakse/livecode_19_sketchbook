// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// theme 60°

const WIDTH = 1920;
const HEIGHT = 1080;
const G_RADIUS = 15;

// https://www.redblobgames.com/grids/hexagons/
const SIZE_W = 2 * G_RADIUS;
const SIZE_H = Math.sqrt(3) * G_RADIUS;
const SPACE_W = 3 * G_RADIUS;
const SPACE_H = SIZE_H * 0.5;
const COLS = Math.ceil(WIDTH / SPACE_W);
const ROWS = Math.ceil((HEIGHT / SIZE_H) * 2) + 1;

console.log({ SIZE_W, SIZE_H, SPACE_W, SPACE_H, COLS, ROWS });

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noiseDetail(2, 0.5);
  //   colorMode(HSB, 1.0);
}

function draw() {
  blendMode(BLEND);
  background("black");
  blendMode(ADD);
  noFill();
  stroke("black");
  translate(width * 0.5, height * 0.5);
  rotate(radians(5));
  translate(width * -0.5, height * -0.5);

  for (let row = -5; row < ROWS + 5; row++) {
    for (let col = -5; col < COLS + 5; col++) {
      const x = col * SPACE_W + (row % 2) * SPACE_W * 0.5;
      const y = row * SPACE_H;
      push();
      translate(x, y);
      noFill();
      stroke("#300");
      strokeWeight(2);
      polygon(0, 0, G_RADIUS, 6);
      // small adjustment spice
      const s1 = map(noise(row * 0.1, col * 0.2, 1), 0, 0.75, 0.3, 0.9);
      // the big / little
      const s2 = noise(row * 0.05, col * 0.1, 2) < 0.3 ? 0.2 : 1;
      scale(s1 * s2);
      // start with same noise as big / little
      // but bump it a little so that its not quite aligned
      // and tighten the threshold a bit
      if (abs(noise(row * 0.05, col * 0.1, 2.0) - 0.3) < 0.01) {
        fill("#0f0");
      } else {
        noFill();
      }
      stroke("#900");
      strokeWeight(2 / (s1 * s2)); // 2, compensated for scale
      polygon(0, 0, G_RADIUS, 6);
      pop();
    }
  }
}

// https://p5js.org/examples/form-regular-polygon.html
function polygon(x, y, radius, npoints) {
  const angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    const sx = x + cos(a) * radius;
    const sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
