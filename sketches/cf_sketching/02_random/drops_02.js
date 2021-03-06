// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("hello");

let dots = [];

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  spawnNear(width * 0.5, height * 0.5, 0);
};

window.draw = function () {
  background(0);

  // automatically add dots

  // run the sim

  dots.forEach((d) => d.step(1 / 60));
  dots.forEach((d) => d.draw());
};

function mouseReleased() {
  dots.push(new Dot(mouseX, mouseY));
}

function spawnNear(x, y, r) {
  let p = randomPointOnCircle();
  dots.push(new Dot(x + p.x * r, y + p.y * r));
}

function randomPointInCircle() {
  let r = sqrt(random());
  let a = random() * 2 * PI;
  return { x: cos(a) * r, y: sin(a) * r };
}

function randomPointOnCircle() {
  let r = 1;
  let a = random() * 2 * PI;
  return { x: cos(a) * r, y: sin(a) * r };
}

class Dot {
  constructor(x = 0, y = 0) {
    this.x = constrain(x, 0, width);
    this.y = constrain(y, 0, height);

    this.age = 0;
  }

  step(dTime) {
    this.age += dTime;

    // spread
    dots.forEach((other) => {
      if (other === this) return;
      let d = dist(this.x, this.y, other.x, other.y);
      if (d > 100) return;

      let a = atan2(this.y - other.y, this.x - other.x);

      // let force = map(d, 0, 100, 0.1, 0, true);
      let force = 1;
      this.x += cos(a) * force;
      this.y += sin(a) * force;
    });

    // spawn new dots
    if (this.age - dTime < 0.05 && this.age >= 0.05) {
      spawnNear(this.x, this.y, 30);
    }

    // remove old dots
    if (this.age > 2) {
      dots.splice(dots.indexOf(this), 1);
    }
  }

  draw() {
    push();

    // draw center dot
    let alpha = map(this.age, 1, 2, 255, 0);
    fill(255, alpha);
    noStroke();
    ellipse(this.x, this.y, 5, 5);

    // draw ripples
    for (let n = 0; n < 1; n += 0.2) {
      let radius = map(this.age - n, 0, 1, 10, 100);
      radius = max(radius, 0);
      let alpha = map(this.age - n, 0, 1, 255, 0);
      noFill();
      stroke(255, alpha);
      ellipse(this.x, this.y, radius, radius);
    }

    pop();
  }
}
