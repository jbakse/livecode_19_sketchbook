// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(512, 512);
  angleMode(DEGREES);
}

function draw() {
  background("black");

  const spiral1 = makeSpiral(
    width * 0.5,
    height * 0.5,
    0,
    height * 0.75,
    0,
    360 * 50,
    30000
  );

  const spiral2 = makeSpiral(
    width * 0.5,
    height * 0.5,
    0,
    height * 0.75,
    0,
    360 * 50,
    30000
  );

  noiseDisplace(spiral2, 300, 100); // big waves
  noiseDisplace(spiral1, 300, 100); // matching big waves
  noiseDisplace(spiral1, 30, 15); // small waves
  noiseDisplace(spiral2, 30, 15, 0.25); // slipped small waves

  noFill();
  stroke("white");
  strokeWeight(1.5);

  strokePoints(spiral1);
  strokeWeight(1);
  strokePoints(spiral2);

  noLoop();
}

function noiseDisplace(points, wavelength = 50, amplitude = 20, slip = 0) {
  push();
  noiseDetail(2, 0.5); // range will be .75
  points.forEach((p) => {
    const nX = noise(p.x / wavelength, p.y / wavelength, 1 + slip) / 0.75;
    const nY = noise(p.x / wavelength, p.y / wavelength, 2 + slip) / 0.75;
    p.x += map(nX, 0, 1, -amplitude, amplitude);
    p.y += map(nY, 0, 1, -amplitude, amplitude);
  });
  pop();
}

// generate array of pCount points on a spiral
// centered on x1, y1
// from radius r1 to radius r2
// from angle a1 to angle a2

function makeSpiral(x1, y1, r1, r2, a1, a2, pCount = 100) {
  const points = [];
  for (let i = 0; i < pCount; i++) {
    const a = lerp(a1, a2, i / pCount);
    const r = lerp(r1, r2, i / pCount);
    const x = x1 + cos(a) * r;
    const y = y1 + sin(a) * r;
    points.push({ x, y });
  }
  console.log(points);
  return points;
}

// draw a line through all the given points

function strokePoints(points) {
  beginShape();
  points.forEach((p) => vertex(p.x, p.y));
  endShape();
}
