// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("hello");

let sprites = [];
let play = true;

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);

  for (let y = 0; y <= height; y += 20) {
    for (let x = 0; x <= width; x += 20) {
      sprites.push(new FlowVector(x, y));
    }
  }
  sprites.push(new Ball());
};

window.draw = function () {
  background(0);
  sprites.forEach((d) => d.step());
  sprites.forEach((d) => d.draw());
};

function mousePressed() {
  play = !play;
  play ? loop() : noLoop();
}

function flowField(x, y) {
  const noise_scale = 0.003;
  const n = noise(x * noise_scale, y * noise_scale);
  return map(n, 0, 1, 0, 2 * PI * 3);
}

class FlowVector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.a = flowField(this.x, this.y);
  }

  step() {}
  draw() {
    push();

    fill(255);
    noStroke();
    ellipse(this.x, this.y, 3, 3);

    stroke(255);
    strokeWeight(1);
    drawVector(this.x, this.y, this.a, 10);
    pop();
  }
}

class Ball {
  constructor() {
    this.x = width * 0.5;
    this.y = height * 0.5;
    this.a = flowField(this.x, this.y);
  }
  step() {
    this.x += sin(this.a);
    this.y += cos(this.a);
    this.a = flowField(this.x, this.y);
    this.x = repeat(this.x, width);
    this.y = repeat(this.y, height);
  }
  draw() {
    push();

    fill(255, 0, 0);
    ellipse(this.x, this.y, 10, 10);

    stroke(255);
    strokeWeight(1);
    drawVector(this.x, this.y, this.a, 20);

    pop();
  }
}

function repeat(v, max) {
  v = v % max;
  if (v < 0) v += max;
  return v;
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
