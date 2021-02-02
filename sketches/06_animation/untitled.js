// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js

let cars = [];

window.setup = function () {
  createCanvas(720, 480);
  noStroke();

  for (let i = 0; i < 100; i++) {
    // cars.push(new car(random(width), random(height)));
    cars.push(new car(width * 0.5, height * 0.5));
  }
  for (let i = 0; i < 100; i++) {
    // cars[i].target = cars[floor(random(cars.length))];
    cars[i].target = cars[(i + 1) % 100];
  }

  // prewarm
  for (let i = 0; i < 10000; i++) {
    cars.forEach((c) => c.step());
  }

  background(0);
};

window.draw = function () {
  background(0, 10);
  cars.forEach((c) => c.step());
  cars.forEach((c) => c.draw());
};

class car {
  constructor(x, y, a = 0, s = 1) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.s = s;
    this.target = false;
  }

  steer() {
    if (!this.target) return;
    this.s *= 1.001;
    const target_x = this.target.x + sin(this.target.a) * -10;
    const target_y = this.target.x - cos(this.target.a) * -10;
    const target_a = atan2(target_x - this.x, this.y - target_y);

    if (this.a < target_a) {
      this.a += 0.1;
    } else {
      this.a -= 0.1;
    }
  }

  step() {
    this.steer();
    this.x += sin(this.a) * this.s;
    this.y += -cos(this.a) * this.s;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.x = width * 0.5;
      this.y = height * 0.5;
      this.s = 1;
    }
  }

  draw() {
    fill(255);
    push();
    translate(this.x, this.y);
    rotate(this.a);
    draw_triangle(10);
    pop();
  }
}

function draw_triangle(r) {
  let a = TWO_PI / 3.0;
  triangle(
    //
    0 + sin(a * 1) * r,
    0 - cos(a * 1) * r,
    0 + sin(a * 2) * r,
    0 - cos(a * 2) * r,
    0 + sin(a * 3) * r,
    0 - cos(a * 3) * r
  );
}
