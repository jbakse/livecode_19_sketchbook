// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

window.setup = function () {
  createCanvas(600, 600);
  frameRate(60);
};

window.draw = function () {
  background(200);
  stroke(50);
  strokeWeight(4);

  circle_3();
};

function circle_1() {
  background(200);
  stroke(50);
  strokeWeight(4);

  const steps = 20;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 200;
  for (let step = 1; step <= steps; step++) {
    const a1 = map(step - 1, 0, steps, 0, 2 * PI);
    const a2 = map(step, 0, steps, 0, 2 * PI);
    const x1 = centerX + sin(a1) * radius;
    const x2 = centerX + sin(a2) * radius;
    const y1 = centerY + cos(a1) * radius;
    const y2 = centerY + cos(a2) * radius;
    line(x1, y1, x2, y2);
  }
}

function circle_2() {
  background(200);
  stroke(50);
  strokeWeight(4);

  const steps = 20;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 200;
  for (let step = 1; step <= steps; step++) {
    const a1 = map(step - 1, 0, steps, 0, 2 * PI);
    const a2 = map(step, 0, steps, 0, 2 * PI);
    let x1 = centerX + sin(a1) * radius;
    let x2 = centerX + sin(a2) * radius;
    let y1 = centerY + cos(a1) * radius;
    let y2 = centerY + cos(a2) * radius;

    x1 += noise(step, 1) * 20;
    y1 += noise(step, 2) * 20;
    x2 += noise(step, 3) * 20;
    y2 += noise(step, 4) * 20;
    line(x1, y1, x2, y2);
  }
}

function circle_3() {
  background(200);
  stroke(50);
  strokeWeight(4);

  const steps = 20;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 200;
  for (let step = 1; step <= steps; step++) {
    const a1 = map(step - 1, 0, steps, 0, 2 * PI);
    let a2 = map(step, 0, steps, 0, 2 * PI);
    if (a2 >= 2 * PI) a2 -= 2 * PI;
    let x1 = centerX + sin(a1) * radius;
    let x2 = centerX + sin(a2) * radius;
    let y1 = centerY + cos(a1) * radius;
    let y2 = centerY + cos(a2) * radius;

    x1 += (noise(a1, 1, frameCount * 0.1) - 0.5) * 150;
    y1 += (noise(a1, 2, frameCount * 0.1) - 0.5) * 150;
    x2 += (noise(a2, 1, frameCount * 0.1) - 0.5) * 150;
    y2 += (noise(a2, 2, frameCount * 0.1) - 0.5) * 150;
    line(x1, y1, x2, y2);
  }
}
