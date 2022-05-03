// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(500, 500);
  background(0, 0, 0);
  noStroke();
  noLoop();
  ellipseMode(CENTER);
}

function draw() {
  background(240, 240, 255);

  // draw clouds
  drawCloudLayer(1, 255);

  // draw horizon shaddow
  fill(0, 0, 0, 10);
  rect(0, height * 0.5 - 2, width, height * 0.5);
  rect(0, height * 0.5 - 1, width, height * 0.5);

  // draw mountains
  drawMountains(1, color(0, 0, 0, 10), 3);
  drawMountains(1, color(0, 0, 0, 10), 1.5);
  drawMountains(1, 240, 0);

  // draw horizon
  fill(240);
  rect(0, height * 0.5, width, height * 0.5);

  // draw clouds
  drawTrees();
}

function drawTrees(noiseSlice) {
  const gridSize = width / 35;
  const showFreq = 0.01;
  const jitterFreq = 0.01;
  noiseDetail(1);
  let row = 0;
  for (let y = height * 0.55; y < height * 1.2; y += gridSize) {
    row++;
    for (let x = 0; x < width * 1.1; x += gridSize) {
      if (noise(x * showFreq, y * showFreq * 2, noiseSlice) > 0.2) {
        const stagger = gridSize * 0.5 * (row % 2);
        let jitterY = noise(x * jitterFreq, y * jitterFreq);
        jitterY = map(jitterY, 0, 0.5, -10, 10);
        drawTree(x + stagger, y + jitterY);
      }
    }
  }
}

function drawTree(x, y) {
  fill(0, 0, 0, 10);
  triangle(x - 11, y + 1, x, y - 32, x + 11, y + 1);
  triangle(x - 12, y + 2, x, y - 34, x + 12, y + 2);

  // make a gray-> green graident, throw in a little noise
  // this probably would have been clearer in HSB
  let green = map(y, height * 0.5, height, 220, 255);
  green += noise(x * 0.1, y * 0.1) * 20;

  fill(220, green, 220);
  triangle(x - 10, y, x, y - 30, x + 10, y);
}

function drawMountains(noiseSlice, color, extra) {
  const gridSize = 80;
  const y = height * 0.5;
  const sizeNoiseFreq = 0.02;

  for (let x = 0; x < width; x += gridSize) {
    let size = noise(x * sizeNoiseFreq, noiseSlice);
    size = map(size, 0, 0.5, 0, 1);
    size = pow(size, 2) * 200;
    fill(color);
    rotRect(x + extra * 0.25, y, size + extra, size + extra, PI * 0.25);
  }
}

function rotRect(x, y, w, h, r) {
  push();
  rectMode(CENTER);
  translate(x, y);
  rotate(r);
  rect(0, 0, w, h);
  pop();
}

function drawCloudLayer(noiseSlice, color) {
  // shadow
  fill(0, 0, 0, 10);
  push();
  translate(1, 1);
  drawClouds(noiseSlice, 1);
  drawClouds(noiseSlice, 2);
  pop();

  // cloud
  fill(color);
  drawClouds(noiseSlice, 0);
}

function drawClouds(noiseSlice, extra) {
  const gridSize = width / 20;
  const showFreq = 0.01;
  const sizeFreq = 0.1;
  const jitterFreq = 0.01;

  noiseDetail(1);
  let row = 0;
  for (let y = 0; y < height * 0.6; y += gridSize) {
    row++;
    for (let x = 0; x < width * 1.1; x += gridSize) {
      if (noise(x * showFreq, y * showFreq * 2, noiseSlice) > 0.25) {
        let sizeNoise = noise(x * sizeFreq, y * sizeFreq, noiseSlice);
        sizeNoise = map(sizeNoise, 0, 0.5, gridSize, gridSize * 2);

        let cloudJitterY = noise(x * jitterFreq, y * jitterFreq, noiseSlice);
        cloudJitterY = map(cloudJitterY, 0, 0.5, -10, 10);

        const stagger = gridSize * 0.5 * (row % 2);

        ellipse(x + stagger, y + cloudJitterY, sizeNoise + extra);
      }
    }
  }
}

// eslint-disable-next-line
function keyPressed() {
  if (key === "S") {
    save("canvas.jpg");
  }
}
