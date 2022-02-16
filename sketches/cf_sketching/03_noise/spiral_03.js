// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require /sketches/_libraries/webm-writer-0.3.0.js
// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require /sketches/_util/grabber_02.js

/* exported setup draw */
const SPEED = 2;

// this code is proably hard to read in a few places.
// i can barely follow it in a couple places
// its not even "right" i didn't mean for it to visit places twice

function setup() {
  createCanvas(512, 512);
  angleMode(DEGREES);
}

function draw() {
  background("black");
  const turns = 360;

  // this feels a lot like the kind of tricks i'm used to
  // from shader programming
  // this divides time into section numbers that are 360 / speed frames long
  const fromIndex = floor((SPEED * frameCount) / 360);
  // this creates a staggared and offest section number
  const toIndex = floor((SPEED * frameCount) / 360 + 0.5) + 1;
  // the numbers should be something like this
  // this isn't quite what i wanted! but it looks fine
  // fromIndex   0 0 0 0 1 1 1 1 2 2 2 2 3 3 3 3 4 4 4 4 5 5 5 5
  // transition   ^   v   ^   v   ^   v   ^   v   ^   v   ^   v
  // toIndex     1 1 2 2 2 2 3 3 3 3 4 4 4 4 5 5 5 5 6 6 6 6 7 7

  // console.log(fromIndex, toIndex, cos(frameCount * 1));

  const spiral1 = makeSpiral(
    // width * 0.25,
    // height * 0.25,
    noise(fromIndex, 1) * width,
    noise(fromIndex, 2) * height,

    height * 0.2,
    height * 0.25,
    0,
    3 * turns,
    3000
  );

  const spiral2 = makeSpiral(
    noise(toIndex, 1) * width,
    noise(toIndex, 2) * height,
    height * 0.2,
    height * 0.25,
    0,
    -3 * turns,
    3000
  );

  // cross fade the points between spiral1 and spiral2

  for (let i = 0; i < spiral1.length; i++) {
    const p1 = spiral1[i];
    const p2 = spiral2[i];
    // the next line cross fades between the two spirals
    // so that the line starts on one spiral and ends at the other
    // the cos slides fade all the way from the tail to the head
    const n = map(i, 0, spiral1.length, 0, 1) + cos(frameCount * SPEED);

    // i take the slide amount (n) and run it through a smoothstep function
    // to add ease in ease out
    p1.x = lerp(p1.x, p2.x, powerSmooth(n, 1));
    p1.y = lerp(p1.y, p2.y, powerSmooth(n, 1));
  }

  // might as well put some noise on it
  noiseDisplace(spiral1, 50, 10, frameCount * 0.03);

  noFill();
  stroke("white");
  strokeWeight(1.5);
  strokePoints(spiral1);
  // strokePoints(spiral2);
}

function noiseDisplace(points, wavelength = 50, amplitude = 20, slip = 0) {
  push();
  noiseDetail(2, 0.5); // range will be .75
  points.forEach((p) => {
    const nX = noise(p.x / wavelength, p.y / wavelength + slip, 1) / 0.75;
    const nY = noise(p.x / wavelength, p.y / wavelength + slip, 2) / 0.75;
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
  // console.log(points);
  return points;
}

// draw a line through all the given points

function strokePoints(points) {
  beginShape();
  points.forEach((p) => vertex(p.x, p.y));
  endShape();
  // ellipse(points[0].x, points[0].y, 10, 10);
}

// https://en.wikipedia.org/wiki/Smoothstep
function smootherstep(edge0, edge1, x) {
  // Scale, and clamp x to 0..1 range
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function powerSmooth(n, p) {
  // loop p times
  let v = n;
  for (let i = 0; i < p; i++) {
    v = smootherstep(0, 1, v);
  }
  return v;
}
