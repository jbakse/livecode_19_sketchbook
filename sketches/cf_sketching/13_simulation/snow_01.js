// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let ps = [];

function setup() {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  ps = times(1000, () => createParticle());
  console.log(ps);

  // "pre-cook"
  mouseX = 10000; // pretend mouse is off screen during cook
  mouseY = 10000;
  times(10000, update);
}

function update() {
  ps.forEach(updateParticle);

  // reuse any particles marked for culling
  // reuse rather than delete and create new
  // to avoid garbage collection
  ps.forEach((p) => {
    if (p.cull) {
      createParticle(p);
    }
  });
}

function draw() {
  update();

  background("black");
  ps.forEach(drawParticle);
}

function createParticle(p = {}) {
  p.x = random(width);
  p.y = -100;
  p.dX = 0;
  p.dY = 0;
  p.drag = random(0.96, 0.97);
  p.size = random(5, 10);
  p.bright = random(0.1, 0.2);
  p.cull = false;

  return p;
}

function updateParticle(p) {
  // push particles away from mouse when close
  const d = dist(mouseX, mouseY, p.x, p.y);
  const f = map(d, 0, 100, 1, 0, true);
  const v = createVector(p.x - mouseX, p.y - mouseY);
  v.normalize();
  p.dX += v.x * f * 1;
  p.dY += v.y * f * 1;

  p.dY += 0.1; // grav

  p.dY *= p.drag;
  p.dX *= p.drag;

  p.y += p.dY;
  p.x += p.dX;
  if (p.x > width) {
    p.x -= width;
  }
  if (p.y > height) {
    p.cull = true;
  }
}

function drawParticle(p) {
  push();
  translate(p.x, p.y);
  noStroke();
  fill(1, 0, 1, p.bright);
  ellipse(0, 0, p.size, p.size);
  fill(1, 0, 1, 0.9);
  ellipse(0, 0, 2, 2);

  pop();
}

function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
