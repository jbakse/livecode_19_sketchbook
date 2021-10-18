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

  background(1, 0, 1);
  drawSky();
};

function draw() {
  g.next();
}

function drawSky() {
  stroke(1, 0, 0, 0.5);
  strokeWeight(0.5);
  let gap = 1.5;
  let y = -10;
  for (let i = 0; i < 100; i++) {
    y += gap;
    gap *= 1.02;
    strokeWeight(map(noise(i * 0.4), 0, 1, 0.1, 0.8));
    sketchyLine(0, y, width, y, 1, 0.05, map(y, 0, 100, 0, 3));
  }
}

function sketchyLine(
  x1,
  y1,
  x2,
  y2,
  stepSize = 5,
  noiseFrequency = 0.01,
  noiseAmplitude = 2
) {
  //const steps = dist(x1, y1, x2, y2) / stepSize;
  let lineLength = dist(x1, y1, x2, y2);
  beginShape();
  vertex(x1, y1);
  for (let n = min(stepSize, lineLength); n < lineLength; n += stepSize) {
    const x = map(n, 0, lineLength, x1, x2);
    const y = map(n, 0, lineLength, y1, y2);
    const nX =
      noise(x * noiseFrequency, y * noiseFrequency, 0) * noiseAmplitude;
    const nY =
      noise(x * noiseFrequency, y * noiseFrequency, 1) * noiseAmplitude;

    vertex(x + nX, y + nY);
  }

  vertex(x2, y2);
  endShape();
}

function* gen() {
  const amplitude = 200;
  const frequency = 0.01;
  const xRes = 1;
  const yRes = 0.4;
  const rough = 5;
  let t = performance.now();
  let i = 0;

  for (let y = 0; y < 480; y += yRes) {
    for (let x = 0; x <= 720; x += xRes) {
      const x1 = x - xRes;
      const x2 = x;
      const y1 =
        50 +
        y +
        steppesteppe(
          x1 * map(y, 0, 480, 10, 0.5),
          y * map(y, 0, 480, 10, 0.5),
          noise(x1 * frequency, y * frequency, 1)
        ) *
          amplitude;
      const y2 =
        50 +
        y +
        steppesteppe(
          x2 * map(y, 0, 480, 10, 0.5),
          y * map(y, 0, 480, 10, 0.5),
          noise(x2 * frequency, y * frequency, 1)
        ) *
          amplitude;

      // roughen
      const _x1 = x1 + noise(x1 * 0.4, y1 * 0.4, 0) * rough;
      const _y1 = y1 + noise(x1 * 0.4, y1 * 0.4, 1) * rough;
      const _x2 = x2 + noise(x2 * 0.4, y2 * 0.4, 0) * rough;
      const _y2 = y2 + noise(x2 * 0.4, y2 * 0.4, 1) * rough;

      // draw mountain blocker
      fill(1, 0, 1);
      noStroke();
      quad(_x1, _y1, _x2, _y2, _x2, _y2 + 40, _x1, _y1 + 40);

      // draw mountain edge
      noFill();

      let quick_slope = (y2 - y1) / (x2 - x1);
      stroke(1, 0, 0, map(quick_slope, -1, 1, 0.5, 0.2, true));
      strokeWeight(0.5);
      //   stroke(1, 0, 0, map(dist(_x1, y1, _x2, _y2), 0, 3, 0.3, 0.2));

      line(_x1, _y1, _x2, _y2);
    }

    i++;
    if (performance.now() - t > 15) {
      //   console.log(i);
      yield 1;
      t = performance.now();
      i = 0;
    }
  }
}

function steppesteppe(x, y, n) {
  const stepped = steppe(n, 6); // + sin(x * 0.1) * 0.01;
  const stepped2 = steppe(n, 11) * 0.5;

  return lerp(stepped, stepped2, noise(x * 0.01, y * 0.01));
  //   return lerp(stepped, stepped2, x / 720);
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
