// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

console.log("Hi");

function setup() {
  createCanvas(1024, 576);
  frameRate(60);

  draw();
  frameRate(1);
  noLoop();
}

function draw() {
  background("white");

  const bounds = new Rect(0, 0, width, height);

  const rects = bounds.partition(6, 4);

  rects.forEach((r) => {
    r.inset(5);
    hatch(r);
  });
}

function hatch(bounds) {
  const v_chance = max(random(), random());
  const h_chance = max(random(), random());
  const v_pack = min(random(1, 12), random(1, 12));
  const h_pack = min(random(1, 12), random(1, 12));

  const squares = pow(2, floor(random(0, 4)));
  const rects = bounds.partition(squares, squares);
  const noise_amount = random(0.5, 5);

  strokeWeight(0.75);
  colorMode(HSB, 1);
  stroke(random(), 1, 0.75);
  rects.forEach((r) => {
    r.inset(1);

    if (random() < v_chance) {
      hatchVertical(r, v_pack, noise_amount);
    }

    if (random() < h_chance) {
      hatchHorizontal(r, h_pack, noise_amount);
    }
  });
}

function hatchVertical(r, pack, noise_amount) {
  for (let x = pack * 0.5; x < r.w; x += pack) {
    noiseyLine(r.l + x, r.t, r.l + x, r.t + r.h, noise_amount);
  }
}

function hatchHorizontal(r, pack, noise_amount) {
  for (let y = pack * 0.5; y < r.h; y += pack) {
    noiseyLine(r.l, r.t + y, r.l + r.w, r.t + y, noise_amount);
  }
}

function noiseyLine(x1, y1, x2, y2, n = 10) {
  const scale = 0.2;
  x1 += noise(x1 * scale, y1 * scale, 0) * n - 0.5;
  y1 += noise(x1 * scale, y1 * scale, 1) * n - 0.5;
  x2 += noise(x1 * scale, y1 * scale, 2) * n - 0.5;
  y2 += noise(x1 * scale, y1 * scale, 3) * n - 0.5;

  // base line
  line(x1, y1, x2, y2);

  // sketchy overdraw
  for (let x = 0; x < 5; x++) {
    const start = constrain(random(-1, 2), 0, 1);
    const end = constrain(random(-1, 2), 0, 1);

    const xx1 = lerp(x1, x2, start);
    const yy1 = lerp(y1, y2, start);
    const xx2 = lerp(x1, x2, end);
    const yy2 = lerp(y1, y2, end);

    push();

    line(xx1, yy1, xx2, yy2);
    pop();
  }
}

class Rect {
  constructor(l, t, w, h) {
    this.l = l;
    this.t = t;
    this.w = w;
    this.h = h;
  }

  draw() {
    rect(this.l, this.t, this.w, this.h);
  }

  inset(l, t = l, r = l, b = t) {
    this.l += l;
    this.t += t;
    this.w -= l + r;
    this.h -= t + b;
  }

  partition(cols, rows) {
    const col_width = this.w / cols;
    const row_height = this.h / rows;
    const partitions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        partitions.push(
          new Rect(
            this.l + col_width * col,
            this.t + row_height * row,
            col_width,
            row_height
          )
        );
      }
    }
    return partitions;
  }
}
