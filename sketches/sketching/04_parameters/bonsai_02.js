// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const pane = new Tweakpane();
const params = {
  yearning: 0,
  twisting: 0,
  leaning: 0,
};

window.setup = function () {
  createCanvas(600, 600);
  noiseSeed(1);

  pane.addInput(params, "yearning", { min: 0, max: 1, step: 0.01 });
  pane.addInput(params, "twisting", { min: 0, max: 1, step: 0.01 });
  pane.addInput(params, "leaning", { min: 0, max: 1, step: 0.01 });

  frameRate(0.5);
  draw();
  loop();
};

window.draw = function () {
  background(200);
  noFill();
  stroke(50, 128);
  strokeWeight(0.5);

  let id = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      push();
      translate(col * 100 + 50, row * 100 + 75);
      line(-30, 0, 30, 0);
      tree(id);
      pop();
      id++;
    }
  }
};

function tree(
  id,
  x = 0,
  y = 0,
  dX = random(-2, 2) * params.leaning,
  dY = -1,
  life = 35
) {
  let step = 0;
  while (life > 0) {
    const oldX = x;
    const oldY = y;
    x += dX;
    y += dY;
    x += random(-params.twisting, params.twisting);
    y += random(-params.twisting, params.twisting);
    dY *= 1 + 0.05 * params.yearning;
    dX *= 1 - 0.05 * params.yearning;
    life--;

    // strokeWeight(r);
    stroke(0);
    line(oldX, oldY, x, y);

    step++;

    if (step == 10) {
      const [dX1, dY1] = rotateXY(dX, dY, PI * 0.25);
      const [dX2, dY2] = rotateXY(dX, dY, PI * -0.25);
      tree(id, x, y, dX1, dY1, life);
      tree(id, x, y, dX2, dY2, life);
      break;
    }
  }
}

function rotateXY(x, y, dA) {
  const a = atan2(x, y);
  const d = dist(0, 0, x, y);
  return [sin(a + dA) * d, cos(a + dA) * d];
}

function noiseMiddle(x, y, z) {
  return noise(x, y, z) * 2 - 1;
}

function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
