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
  if (dots.length) {
    dots = [];
  } else {
    dots.push(new Dot(mouseX, mouseY));
  }
}

function spawnNear(x, y, dist, parent = null) {
  let p = randomPointOnCircle();
  dots.push(new Dot(x + p.x * dist, y + p.y * dist, parent));
}

class Dot {
  constructor(x = 0, y = 0, parent) {
    this.x = constrain(x, 0, width);
    this.y = constrain(y, 0, height);
    this.r = 15;
    this.parent = parent;
    this.age = 0;
    this.gen = (this.parent?.gen || 0) + 1;
  }

  step(dTime) {
    this.age += dTime;

    // spread
    dots.forEach((other) => {
      if (other === this) return;
      let d = dist(this.x, this.y, other.x, other.y);
      if (d > this.r) return;

      let a = atan2(this.y - other.y, this.x - other.x);

      let force = map(d, 0, this.r, 1, 0, true);

      this.x += cos(a) * force;
      this.y += sin(a) * force;
    });

    // attract toward parent
    if (this.parent) {
      let d = dist(this.x, this.y, this.parent.x, this.parent.y);
      let a = atan2(this.y - this.parent.y, this.x - this.parent.x);
      let force = map(d, 0, this.r, 0, 1, true);
      this.x += cos(a) * -force;
      this.y += sin(a) * -force;
    }

    // walls
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);

    // spawn new dots
    if (dots.length < 100) {
      let spawn_time = 0.5;
      if (this.age - dTime < spawn_time && this.age >= spawn_time) {
        let target_x = this.x;
        let target_y = this.y;
        if (this.parent) {
          let a = atan2(this.y - this.parent.y, this.x - this.parent.x);
          target_x = this.x + cos(a) * 2;
          target_y = this.y + sin(a) * 2;
        }

        spawnNear(target_x, target_y, 1, this);
        if (random() < 0.2) {
          spawnNear(target_x, target_y, 1, this);
        }
      }
    }

    // remove old dots
    // if (this.age > 10) {
    //   dots.splice(dots.indexOf(this), 1);
    // }
  }

  draw() {
    push();

    // draw  dot

    stroke(255, 100);
    noFill();
    // ellipse(this.x, this.y, this.r, this.r);

    // draw path
    stroke(255);
    if (this.parent) {
      line(this.parent.x, this.parent.y, this.x, this.y);
    }

    pop();
  }
}

function jitter_ellipse(x, y, w, h, j = 0) {
  x += random(-j, j);
  y += random(-j, j);
  w += random(-j, j);
  h += random(-j, j);
  ellipse(x, y, w, h);
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

// https://open.spotify.com/track/4FnK3GEuekjYXavXPIGlmQ?si=QVx_ccBXQFubV_e-xG6QlA
