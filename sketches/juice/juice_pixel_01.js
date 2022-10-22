// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const sprites = [];

const WIDTH = 512;
const HEIGHT = 512;
const PIXELATE = 8; // 1, 2, 4, 8, ...

function pixelatedStrokeWeight(n) {
  strokeWeight(n * PIXELATE);
}
function setup() {
  pixelDensity(1);

  const c = createCanvas(WIDTH / PIXELATE, HEIGHT / PIXELATE).canvas;
  c.style.width = `${WIDTH}px`;
  c.style.height = `${HEIGHT}px`;
  c.style.imageRendering = "pixelated";

  noFill();
  noStroke();

  for (let i = 0; i < 100; i++) {
    sprites.push({
      x: random(WIDTH),
      y: random(HEIGHT),
      dX: random(1, 2),
      dY: 0,
      size: random(10, 50),
    });
  }
}

function draw() {
  // update
  for (const sprite of sprites) {
    sprite.x += sprite.dX;
    sprite.y += sprite.dY;
    sprite.x = mod(sprite.x, WIDTH);
    sprite.y = mod(sprite.y, HEIGHT);
  }

  // adjust for pixelate
  scale(1 / PIXELATE);

  // draw
  push();
  background("black");
  stroke("white");
  pixelatedStrokeWeight(1);
  for (const sprite of sprites) {
    ellipse(sprite.x, sprite.y, sprite.size);
  }
  ellipse(WIDTH * 0.5, HEIGHT * 0.5, 512);
  pop();

  filter(THRESHOLD, 0.5);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}
