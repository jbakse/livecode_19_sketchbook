// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const sprites = [];

function setup() {
  createCanvas(512, 512);
  noFill();
  noStroke();

  for (let i = 0; i < 100; i++) {
    sprites.push({
      x: random(width),
      y: random(height),
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
    sprite.x = mod(sprite.x, width);
    sprite.y = mod(sprite.y, height);
  }

  // draw
  push();
  background("black");
  stroke("white");
  for (const sprite of sprites) {
    ellipse(sprite.x, sprite.y, sprite.size);
  }
  ellipse(width * 0.5, height * 0.5, 512);
  pop();
}

function mod(n, m) {
  return ((n % m) + m) % m;
}
