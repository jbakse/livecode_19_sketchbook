// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let camera_x = 0;

function setup() {
  createCanvas(480, 480);
  frameRate(60);
  console.log("hi");
}

function draw() {
  background(50, 50, 70);

  if (keyIsDown(65 /*a*/)) {
    camera_x -= 10;
  }

  if (keyIsDown(68 /*d*/)) {
    camera_x += 10;
  }

  plotFunction();
  drawWorld();
}

function drawWorld() {
  translate(-camera_x + 240, 0);

  // draw old man
  noStroke();
  fill("yellow");
  console.log(camera_x);
  ellipse(camera_x, 200, 10, 10);

  // draw column grid
  noFill();
  stroke(255, 100);

  const currentColumn = Math.floor(camera_x / 32);

  for (let col = currentColumn - 13; col < currentColumn + 13; col++) {
    wave1(col * 32) > 0 ? fill(255) : noFill();

    rect(col * 32, 240 - 32, 32, 32);
  }

  for (let col = currentColumn - 13; col < currentColumn + 13; col++) {
    wave1(col * 32) > 0.5 ? fill(255) : noFill();

    rect(col * 32, 240 - 64, 32, 32);
  }
}

function plotFunction() {
  push();
  noStroke();
  fill(0);
  rect(0, 240, 480, 240);

  stroke(150);
  line(0, 240, 480, 240);

  stroke(100);
  line(0, 360, 480, 360);
  line(240, 260, 240, 460);

  translate(240, 360);
  plot(wave1, camera_x);
  pop();
}

function wave1(x) {
  return sin(x * 10000000.12);
}

function plot(f, pos = 0) {
  push();
  stroke(255);
  noFill();

  beginShape();

  for (x = -240; x < 240; x += 1) {
    vertex(x, -f(pos + x) * 100);
  }

  endShape();
  pop();
}
