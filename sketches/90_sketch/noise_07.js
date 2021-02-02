// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// idea for this sketch:
// start with a layered mountain scape
// kind of like Unknown Pleasures album art
// then push lots of layering/subtlety
// move towards a natural looking field or mountain
// or maybe something else

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  noFill();
  stroke(1, 0, 0.9);
};

window.draw = function () {
  background(1, 0, 0);

  const amplitude = 300;
  const frequency = 0.01;
  for (let y = 0; y < 480; y += 10) {
    for (let x = 0; x <= 720; x += 10) {
      const x1 = x - 10;
      const x2 = x;
      const y1 = y + noise(x1 * frequency, y * frequency, 1) * amplitude;
      const y2 = y + noise(x2 * frequency, y * frequency, 1) * amplitude;

      // draw mountain blocker
      fill(1, 0, 0);
      noStroke();
      quad(x1, y1, x2, y2, x2, y2 + 300, x1, y1 + 300);

      // draw mountain edge
      noFill();
      stroke(1, 0, 0.9);
      line(x1, y1, x2, y2);
    }
  }
};
