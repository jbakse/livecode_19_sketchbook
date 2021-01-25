// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("hello");

let dots = [];

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
};

window.draw = function () {
  background(0);

  // automatically add dots

  if (random() < 0.1) {
    dots.push(new Dot(random(0, width), random(0, height)));
  }

  // run the sim

  dots.forEach((d) => d.step(1 / 60));
  dots.forEach((d) => d.draw());
};

function mouseReleased() {
  dots.push(new Dot(mouseX, mouseY));
}

class Dot {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.age = 0;
  }

  step(dTime) {
    this.age += dTime;
    if (this.age > 2) {
      dots.splice(dots.indexOf(this), 1);
    }
  }
  draw() {
    push();

    let alpha = map(this.age, 1, 2, 255, 0);
    fill(255, alpha);
    noStroke();
    ellipse(this.x, this.y, 10, 10);

    noFill();

    for (let n = 0; n < 1; n += 0.2) {
      let radius = map(this.age - n, 0, 1, 10, 100);
      radius = max(radius, 0);
      let alpha = map(this.age - n, 0, 1, 255, 0);
      stroke(255, alpha);
      ellipse(this.x, this.y, radius, radius);
    }

    pop();
  }
}
