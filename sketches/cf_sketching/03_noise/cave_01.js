// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const COL_WIDTH = 32;
function setup() {
  createCanvas(512, 512);
}

function draw() {
  background("#fff");

  stroke("black");
  strokeWeight(2);

  for (let x = -width; x < width; x += 30) {
    warped_line(x, 0, x + width, height);
  }

  // i decided i wanted the drips to go up, so flip the whole thing
  translate(width * 0.5, height * 0.5);
  rotate(PI);
  translate(-width * 0.5, -height * 0.5);

  push();
  stroke("white");
  strokeWeight(8);
  translate(0, 50);
  drawDrips(1);
  pop();

  push();
  fill("#fff");
  translate(0, 50);
  drawDrips(1);
  pop();
}

function drawDrips(z) {
  push();
  noStroke();
  rect(0, -16, width, -100);
  pop();

  push();

  beginShape();
  curveVertex(-32, -16);
  curveVertex(-16, -16);

  for (let i = 0; i < 16; i++) {
    noiseDetail(2, 0.5);
    const n = max(
      noise(i, (frameCount + i) / 600, z),
      noise(i, (frameCount + i) / 600, z + 1)
    ); // get some noise

    const nN = map(n, 0, 0.75, 0, 1); // normalize the noise (this is my album title)
    const pnN = pow(nN, 3); // raise the noise (also a good album title)
    const drip = map(pnN, 0, 1, 64, 512); // how long should the drips get?
    warped_curveVertex((i + 0.0) * COL_WIDTH, drip * 0.0);
    warped_curveVertex((i + 0.0) * COL_WIDTH, drip * 0.3);
    warped_curveVertex((i + 0.0) * COL_WIDTH, drip * 0.5);
    warped_curveVertex((i + 0.0) * COL_WIDTH, drip * 0.7);
    warped_curveVertex((i + 0.0) * COL_WIDTH, drip * 1.0);
    warped_curveVertex((i + 0.5) * COL_WIDTH, drip * 1.0);
    warped_curveVertex((i + 0.5) * COL_WIDTH, drip * 0.7);
    warped_curveVertex((i + 0.5) * COL_WIDTH, drip * 0.5);
    warped_curveVertex((i + 0.5) * COL_WIDTH, drip * 0.3);
    warped_curveVertex((i + 0.5) * COL_WIDTH, drip * 0.0);
  }
  curveVertex(16 * COL_WIDTH, -16);
  curveVertex(16 * COL_WIDTH + 16, -16);

  endShape();
  pop();
}

function warped_line(x1, y1, x2, y2) {
  // draw line from x1, y1 to x2, y2 in 10 segments + 2 control points
  beginShape();

  for (let i = -1; i < 11; i++) {
    const x = map(i, 0, 10, x1, x2);
    const y = map(i, 0, 10, y1, y2);
    const nX = noise(x * 0.01, y * 0.01, 1 + frameCount * 0.01) * 25;
    const nY = noise(x * 0.01, y * 0.01, 2 + frameCount * 0.01) * 25;
    curveVertex(x + nX, y + nY);
  }
  endShape();
}
function warped_curveVertex(x, y) {
  const t = frameCount * 0.01 + x * 0.01;
  const nX = noise(x * 0.01, y * 0.01, 1 + t) * 25;
  const nY = noise(x * 0.01, y * 0.01, 2 + t) * 25;
  curveVertex(x + nX, y + nY);
}
