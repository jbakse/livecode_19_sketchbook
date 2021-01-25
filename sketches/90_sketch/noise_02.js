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
  for (let s = 0; s < 10; s++) {
    dots.forEach((d) => d.step());
  }
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
    this.age = 0;
  }

  step() {
    this.age += 1;

    const noise_scale = 0.003;
    const noise_scroll = 0.01;

    noiseDetail(2, 0.5);
    const n = noise(
      this.x * noise_scale,
      this.y * noise_scale,
      frameCount * noise_scroll
    );
    this.a = map(n, 0, 1, 0, 2 * PI * 3);
    this.a = wrap(this.a, 0, 2 * PI);

    const flow_speed = 0.5;
    this.x += sin(this.a) * flow_speed;
    this.y += cos(this.a) * flow_speed;

    this.repel();

    if (this.x < 0) this.respawn();
    if (this.x > width) this.respawn();
    if (this.y < 0) this.respawn();
    if (this.y > height) this.respawn();
  }
  respawn() {
    this.x = random(width);
    this.y = random(height);

    const clear = () => {
      let flag = true;
      dots.forEach((other) => {
        if (other === this) return;
        const manhattan_d = abs(this.x - other.x) + abs(this.y - other.y);
        if (manhattan_d < 20) {
          flag = false;
          return;
        }
      });
      return flag;
    };

    let tries = 0;
    while (!clear() && tries < 100) {
      tries++;
      this.x = random(width);
      this.y = random(height);
    }

    this.age = 0;
  }

  repel() {
    const repel_distance = 20;
    dots.forEach((other) => {
      if (other === this) return;
      if (abs(this.x - other.x) > repel_distance) return;
      if (abs(this.y - other.y) > repel_distance) return;
      let d = dist(this.x, this.y, other.x, other.y);
      if (d > repel_distance) return;

      let a = atan2(this.y - other.y, this.x - other.x);

      const repel_force = 3;
      let force = map(d, 0, repel_distance, repel_force, 0, true);

      this.x += cos(a) * force;
      this.y += sin(a) * force;
    });
  }
  draw() {
    push();

    fill(255);
    noStroke();
    ellipse(this.x, this.y, 2, 2);

    stroke(255);
    strokeWeight(1);

    drawVector(this.x, this.y, this.a, constrain(this.age * 0.1, 0, 10));
  }
}

function wrap(v, min, max) {
  let w = max - min;
  while (v < min) v += w;
  while (v > max) v -= w;
  return v;
}

function drawVector(x, y, a, l) {
  let dX = sin(a) * l;
  let dY = cos(a) * l;
  drawLine(x, y, a, l);
  const arrow_angle = 0.9;
  const arrow_length = min(3, l);
  drawLine(x + dX, y + dY, a + PI + arrow_angle, arrow_length);
  drawLine(x + dX, y + dY, a + PI - arrow_angle, arrow_length);
}

function drawLine(x, y, a, l) {
  let dX = sin(a) * l;
  let dY = cos(a) * l;
  line(x, y, x + dX, y + dY);
}
