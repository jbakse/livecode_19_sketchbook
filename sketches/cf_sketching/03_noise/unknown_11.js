// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// lets see if i can use a generator to show my work
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

// i used smoothstep in here to actually litterally smooth the steppes!
// set up the draw function as a generator so you can watch it work!

const g = gen();
window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  noFill();
  stroke(1, 0, 0.9);

  noiseDetail(3);
};

function draw() {
  g.next();
}

function* gen() {
  console.log("g");
  background(1, 0, 1);

  const amplitude = 300;
  const frequency = 0.01;
  const xRes = 1;
  const yRes = 0.2;
  for (let y = 0; y < 480; y += yRes) {
    for (let x = 0; x <= 720; x += xRes) {
      const x1 = x - xRes;
      const x2 = x;
      const y1 =
        y + recurve(x, y, noise(x1 * frequency, y * frequency, 1)) * amplitude;
      const y2 =
        y + recurve(x, y, noise(x2 * frequency, y * frequency, 1)) * amplitude;

      const _x1 = x1 + noise(x1, y1, 0) * 4;
      const _y1 = y1 + noise(x1, y1, 1) * 4;
      const _x2 = x2 + noise(x2, y2, 0) * 4;
      const _y2 = y2 + noise(x2, y2, 1) * 4;

      // draw mountain blocker
      fill(1, 0, 1);
      noStroke();
      quad(_x1, _y1, _x2, _y2, _x2, _y2 + 40, _x1, _y1 + 40);

      // draw mountain edge
      noFill();
      stroke(1, 0, 0, 0.2);

      //   stroke(1, 0, 0, map(dist(_x1, y1, _x2, _y2), 0, 3, 0.3, 0.2));
      line(_x1, _y1, _x2, _y2);
    }

    yield 1;
  }
}

function recurve(x, y, n) {
  const stepped = steppe(n, 10);
  //   const stepped2 = steppe(n, 7);

  return lerp(stepped, n, noise(x * 0.2, y * 0.2));
}

function steppe(n, steppes) {
  const i = floor(n * steppes);
  const f = fract(n * steppes);
  // https://en.wikipedia.org/wiki/Smoothstep
  const smooth_f = smoothstep(0.45, 0.55, f);
  const stepped = (i + smooth_f) / steppes;

  return stepped;
}

//https://en.wikipedia.org/wiki/Smoothstep
function smoothstep(edge0, edge1, x) {
  // Scale, bias and saturate x to 0..1 range
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * (3 - 2 * x);
}
