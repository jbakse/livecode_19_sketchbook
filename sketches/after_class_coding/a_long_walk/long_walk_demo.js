// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const flower_colors = ["red", "yellow", "white"];

function setup() {
  createCanvas(512, 256);
  noStroke();
  fill(0);
}

function flowerLine(x) {
  //   let v = sin((x + 200) * 0.05) * 2;
  let v = map(noise(x * 0.01), 0, 1, -1, 1);
  return v;
}
function flowerColor(x) {
  //   return floor(map(sin(x), -1, 1, 0, 3));

  return floor(x / 100) % 3;
}
function draw() {
  background(200);
  translate(-mouseX * 8, 0);
  for (let x = mouseX * 8 + 32; x < mouseX * 8 + 480; x += 8) {
    // draw flowers
    noStroke();
    fill("green");
    if (flowerLine(x) > 0) {
      rect(x, 32, 8, 8);
      fill(flower_colors[flowerColor(x)]);
      ellipse(x + 4, 32, 8, 8);
    }

    // draw ground
    noStroke();
    fill("brown");
    rect(x, 40, 8, 8);

    stroke(0, 50);
    line(x, 0, x, 256);
  }

  // plot it
  for (let x = 0; x < 512; x++) {
    const v = flowerLine(x);
    ellipse(x, 240 + v * 10, 2, 2);
  }

  stroke(0, 100);
  line(0, 240, 512, 240);
}
