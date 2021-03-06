// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("hello");

let dots = [];
let play = true;

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);

  for (let y = 0; y <= height; y += 20) {
    for (let x = 0; x <= width; x += 20) {
      dots.push(new Dot(x, y));
    }
  }
};

window.draw = function () {
  background(0);
  dots.forEach((d) => d.step());
  dots.forEach((d) => d.draw());
};

function mousePressed() {
  play = !play;
  play ? loop() : noLoop();
}

class Dot {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  step() {}
  draw() {
    push();

    fill(255);
    noStroke();
    ellipse(this.x, this.y, 2, 2);

    stroke(255);
    strokeWeight(1);

    const noise_scale = 0.003;
    noiseDetail(3, 0.5);
    const n = noise(this.x * noise_scale, this.y * noise_scale);

    let a = map(n, 0, 1, 0, 2 * PI * 3);

    drawVector(this.x, this.y, a, 10);
  }
}

function drawVector(x, y, a, l) {
  let dX = sin(a) * l;
  let dY = cos(a) * l;
  drawLine(x, y, a, l);
  const arrow_angle = 0.9;
  const arrow_length = 3;
  drawLine(x + dX, y + dY, a + PI + arrow_angle, arrow_length);
  drawLine(x + dX, y + dY, a + PI - arrow_angle, arrow_length);
}

function drawLine(x, y, a, l) {
  let dX = sin(a) * l;
  let dY = cos(a) * l;
  line(x, y, x + dX, y + dY);
}
