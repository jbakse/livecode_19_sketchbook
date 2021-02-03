// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

window.setup = function () {
  createCanvas(600, 600);
  frameRate(12);

  noiseSeed(1);
  // Repeat.
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

function tree(id, x = 0, y = 0, dX = random(-1, 1), dY = -1, r) {
  r = r || map(noise(id), 0, 1, 5, 10);

  stroke(50, 128);
  strokeWeight(0.5);
  fill(200);

  let step = 0;

  // branch
  while (r > 1) {
    ellipse(x, y, r, r);

    x += dX;
    y += dY;
    x += noiseMiddle(id, step) * 2;
    y += noiseMiddle(id, step) * 2;
    r = r - 0.2;

    dX *= 0.9;
    if (random() < 0.1) {
      tree(id, x, y, dX - random(0.5, 2), -1, r * 0.8);
      tree(id, x, y, dX + random(0.5, 2), -1, r * 0.8);
      break;
    }

    step++;
  }

  // leaf
  times(10, (i) => {
    let _x = random(-5, 5);
    let _y = random(-3, 3);
    let _h = random(1, 3);
    let _w = _h;

    ellipse(x + _x, y + _y, _w, _h);
  });
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
