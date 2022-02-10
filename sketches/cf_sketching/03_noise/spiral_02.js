// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// wasn't satisfied with the previous versions feeling
// this version tries applying distortion in the angle/radius domain
// instead of the xy domain

function setup() {
  createCanvas(512, 512);
  angleMode(DEGREES);
}

function draw() {
  background("black");

  const spiral1 = makeSpiral(0, height * 0.75, 0, 360 * 40, 30000);
  const spiral2 = JSON.parse(JSON.stringify(spiral1)); // deep clone

  noiseDisplace(spiral2, 300, 50); // big waves
  noiseDisplace(spiral1, 300, 50); // matching big waves
  noiseDisplace(spiral1, 30, 5); // small waves
  noiseDisplace(spiral2, 30, 6, 0.5); // slipped small waves

  noFill();
  stroke("white");
  translate(width * 0.5, height * 0.5);

  strokeWeight(1.5);
  strokePoints(spiral1);
  strokeWeight(1);
  strokePoints(spiral2);

  // noLoop();
}

function noiseDisplace(points, wavelength = 50, amplitude = 20, slip = 0) {
  push();
  noiseDetail(2, 0.5); // range will be .75
  points.forEach((p) => {
    const factor = p.a * p.r * 0.003; // adjusted to taste
    // w/o animation
    const n = noise(factor / wavelength, 1 + slip);

    // w/ animation
    // const n = noise(
    //   factor / wavelength + frameCount * 0.02,
    //   1 + slip + frameCount * 0.01
    // );
    p.r += map(n, 0, 0.75, -amplitude, amplitude);
  });
  pop();
}

// generate array of pCount points on a spiral
// centered on 0, 0
// from radius r1 to radius r2
// from angle a1 to angle a2

function makeSpiral(r1, r2, a1, a2, pCount = 100) {
  const points = [];
  for (let i = 0; i < pCount; i++) {
    const a = lerp(a1, a2, i / pCount);
    const r = lerp(r1, r2, i / pCount);
    points.push({ a, r });
  }
  return points;
}

// draw a line through all the given points

function strokePoints(points) {
  beginShape();
  points.forEach((p) => {
    const x = cos(p.a) * p.r;
    const y = sin(p.a) * p.r;
    vertex(x, y);
  });
  endShape();
}
