// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// idea for this sketch:
// start with a layered mountain scape
// kind of like Unknown Pleasures album art
// then push lots of layering/subtlety
// move towards a natural looking field or mountain
// or maybe something else

// some thoughts
// yeah this is looking kind of interesting,
// i don't really like the contrast between the
// cliffs and the Plateaus. i want to round the edges
// would also be nice to make the plateau height less
// perfectly even.
// also want to make the lerp between steppes and rolling hills pop

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  noFill();
  stroke(1, 0, 0.9);

  noiseDetail(3);
  noLoop();
};

window.draw = function () {
  background(1, 0, 1);

  const amplitude = 300;
  const frequency = 0.01;
  const xRes = 1;
  const yRes = 0.5;
  for (let y = 0; y < 240; y += yRes) {
    for (let x = 0; x <= 360; x += xRes) {
      const x1 = x - xRes;
      const x2 = x;
      const y1 =
        y + recurve(x, y, noise(x1 * frequency, y * frequency, 1)) * amplitude;
      const y2 =
        y + recurve(x, y, noise(x2 * frequency, y * frequency, 1)) * amplitude;

      const _x1 = x1 + noise(x1, y1, 0) * 3;
      const _y1 = y1 + noise(x1, y1, 1) * 3;
      const _x2 = x2 + noise(x2, y2, 0) * 3;
      const _y2 = y2 + noise(x2, y2, 1) * 3;

      // draw mountain blocker
      fill(1, 0, 1);
      noStroke();
      quad(_x1, _y1, _x2, _y2, _x2, _y2 + 40, _x1, _y1 + 40);

      // draw mountain edge
      noFill();
      stroke(1, 0, 0, 0.5);
      line(_x1, _y1, _x2, _y2);
    }
  }
};

function recurve(x, y, n) {
  const steps = 10.0;

  const stepped = Math.floor(n * steps) / steps;

  return lerp(stepped, n, noise(x * 0.02, y * 0.02));
}
