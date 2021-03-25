// require /sketches/_libraries/webm-writer-0.3.0.js
// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// require /sketches/_util/grabber_02.js

/* exported setup draw*/

function setup() {
  pixelDensity(1);
  createCanvas(852, 480);
}

function draw() {
  blendMode(BLEND);
  background("black");

  // translate(width * 0.5, height * 0.5);
  // scale(2, 2);
  // translate(-width * 0.5, -height * 0.5);

  blendMode(ADD);

  fill(10);
  noStroke();

  const t = frameCount * 0.01;
  const myCurve = new Bezier();
  const lines = 20;
  const points = 50;
  for (let i = 0; i < lines; i++) {
    let n = map(i, 0, lines, 0, 2);
    myCurve.p1 = {
      x: 100, //noise(t + n, 0 + n) * width,
      y: noise(t + n, 1 + n) * height,
    };
    myCurve.p2 = {
      x: 200, //noise(t + n, 2 + n) * width,
      y: noise(t + n, 3 + n) * height,
    };
    myCurve.p3 = {
      x: 650, //noise(t + n, 4 + n) * width,
      y: noise(t + n, 5 + n) * height,
    };
    myCurve.p4 = {
      x: 750, //noise(t + n, 6 + n) * width,
      y: noise(t + n, 7 + n) * height,
    };
    let line = myCurve.getLine(points);

    stroke(50);
    strokeWeight(4);
    noFill();

    beginShape();
    for (const p of line) {
      // ellipse(p.x, p.y, 4, 4);
      vertex(p.x, p.y);
    }
    endShape();
  }
}

// https://javascript.info/bezier-curve
class Bezier {
  constructor(p1, p2, p3, p4) {
    this.p1 = p1 || new Point(0, 0);
    this.p2 = p2 || new Point(0, 0);
    this.p3 = p3 || new Point(0, 0);
    this.p4 = p4 || new Point(0, 0);
  }
  getLine(steps = 100) {
    if (steps < 2) steps = 2;
    let ps = [this.p1];
    for (let i = 1; i < steps - 1; i++) {
      const n = map(i, 0, steps - 1, 0, 1);
      //   const _1x = lerp(this.p1.x, this.p2.x, n);
      //   const _1y = lerp(this.p1.y, this.p2.y, n);
      //   const _2x = lerp(this.p2.x, this.p3.x, n);
      //   const _2y = lerp(this.p2.y, this.p3.y, n);
      //   const _3x = lerp(this.p3.y, this.p4.y, n);
      //   const _3y = lerp(this.p3.y, this.p4.y, n);

      const x =
        //
        (1 - n) ** 3 * this.p1.x +
        //
        3 * (1 - n) ** 2 * n * this.p2.x +
        //
        3 * (1 - n) * n ** 2 * this.p3.x +
        //
        n ** 3 * this.p4.x;

      const y =
        //
        (1 - n) ** 3 * this.p1.y +
        //
        3 * (1 - n) ** 2 * n * this.p2.y +
        //
        3 * (1 - n) * n ** 2 * this.p3.y +
        //
        n ** 3 * this.p4.y;

      ps.push({ x, y });
    }
    ps.push(this.p4);
    return ps;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
