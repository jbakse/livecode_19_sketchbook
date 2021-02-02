// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

window.setup = function () {
  createCanvas(600, 600);
  frameRate(60);
};

window.draw = function () {
  background(200);
  stroke(50);
  strokeWeight(4);

  lines_3();
};

function lines_1() {
  for (let x = 100; x <= 500; x += 10) {
    let x1 = x;
    let y1 = 200;
    let x2 = x;
    let y2 = 400;
    line(x, 200, x, 400);
  }
}

function lines_2() {
  for (let x = 100; x <= 500; x += 10) {
    let x1 = x;
    let y1 = 200;
    let x2 = x;
    let y2 = 400;
    x1 += (noise(x) - 0.5) * 30;

    line(x1, y1, x2, y2);
  }
}

function lines_3() {
  for (let x = 100; x <= 500; x += 10) {
    let x1 = x;
    let y1 = 200;
    let x2 = x;
    let y2 = 400;
    x1 += (noise(x, 1) - 0.5) * 30;
    x2 += (noise(x, 2) - 0.5) * 30;

    line(x1, y1, x2, y2);
  }
}

function lines_4() {
  for (let x = 100; x <= 500; x += 10) {
    let x1 = x;
    let y1 = 200;
    let x2 = x;
    let y2 = 400;
    x1 += (noise(x, frameCount * 0.05, 1) - 0.5) * 100;
    x2 += (noise(x, frameCount * 0.05, 2) - 0.5) * 100;

    line(x1, y1, x2, y2);
  }
}
