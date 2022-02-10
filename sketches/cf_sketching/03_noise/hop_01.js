// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const waypoints = range(0, 16);

function setup() {
  createCanvas(512, 512);
  noiseDetail(2, 0.5); // range .75
  colorMode(HSB, 1);
  shuffle(waypoints, true);
  waypoints.splice(8);
  waypoints.sort((a, b) => a - b);
}

function noiseA(x, y, z) {
  return map(noise(x, y, z), 0, 0.75, -1, 1);
}

// crate an array of numbers from [min to max)
function range(min, max) {
  const arr = [];
  for (let i = min; i < max; i++) {
    arr.push(i);
  }
  return arr;
}

function draw() {
  background("#eee");

  const locs = [];

  const count = 16;
  for (let i = 0; i < count; i++) {
    const t = frameCount / 60 + i / count;
    const x = (i % 4) * 128 + 64;
    const y = floor(i / 4) * 128 + 64;
    const nX = noiseA(i / 2, 1, t) * 20;
    const nY = noiseA(i / 2, 2, t) * 20;
    locs.push({ x: x + nX, y: y + nY });
  }

  // scale the drawing down

  translate(width / 2, height / 2);
  scale(0.75);
  translate(-width / 2, -height / 2);
  // draw the floaters
  locs.forEach(({ x, y }) => {
    push();
    translate(x, y);
    drawFloater();
    pop();
  });

  // draw the path
  // loop over pathStops
  for (let i = 1; i < waypoints.length; i++) {
    const start = locs[waypoints[i - 1]];
    const end = locs[waypoints[i]];

    noFill();
    strokeWeight(4);
    stroke(0, 1, i / waypoints.length);
    const d = dist(start.x, start.y, end.x, end.y);
    curve(
      start.x,
      start.y + d * 4,
      start.x,
      start.y,
      end.x,
      end.y,
      end.x,
      end.y + d * 4
    );
  }
}

// draw an upside down pyramid
function drawFloater() {
  push();
  noStroke();

  // top
  fill("#aaa");
  beginShape();
  vertex(0, 10);
  vertex(20, 0);
  vertex(0, -10);
  vertex(-20, 0);
  endShape(CLOSE);

  // left
  fill("#666");
  beginShape();
  vertex(0, 10);
  vertex(-20, 0);
  vertex(0, 40);
  endShape(CLOSE);

  // right
  fill("#888");
  beginShape();
  vertex(0, 10);
  vertex(20, 0);
  vertex(0, 40);
  endShape(CLOSE);

  pop();
}
