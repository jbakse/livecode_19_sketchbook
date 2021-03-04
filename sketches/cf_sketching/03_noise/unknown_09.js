// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// idea for this sketch:
// start with a layered mountain scape
// kind of like Unknown Pleasures album art
// then push lots of layering/subtlety
// move towards a natural looking field or mountain
// or maybe something else

// some thoughts
// i like where this is going
// might want to switch to black on white, more like pencil drawwing
// i could add a lighting model, but i kind of want to go away from that
// it runs really slow on my computer, thats mostly fine
// might speed up on a better machine, or in webgl
// the noise function is really "raw from the tube"
// it would be nice to get in there and mess with the shape of the noise
// so it didn't look so much like a noise demo
// maybe chunk up some layers
// maybe add another noise over top of all the line drawing to shake the morie

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
  background(1, 0, 0);

  const amplitude = 300;
  const frequency = 0.01;
  const xRes = 1;
  const yRes = 0.2;
  for (let y = 0; y < 240; y += yRes) {
    for (let x = 0; x <= 360; x += xRes) {
      const x1 = x - xRes;
      const x2 = x;
      const y1 = y + noise(x1 * frequency, y * frequency, 1) * amplitude;
      const y2 = y + noise(x2 * frequency, y * frequency, 1) * amplitude;

      // draw mountain blocker
      fill(1, 0, 0);
      noStroke();
      quad(x1, y1, x2, y2, x2, y2 + 10, x1, y1 + 10);

      // draw mountain edge
      noFill();
      stroke(1, 0, 1, 0.5);
      line(x1, y1, x2, y2);
    }
  }
};
