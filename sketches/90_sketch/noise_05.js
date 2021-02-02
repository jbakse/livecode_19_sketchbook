// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");

window.setup = function () {
  createCanvas(720, 480);
  frameRate(60);
  colorMode(HSB, 1);

  draw();
  frameRate(1);
};

window.draw = function () {
  background(0, 0, 0.2);

  fill("red");
  stroke("white");

  let r = new Rect(0, 0, width, height);

  let rects = r.partition(6, 4);

  rects.forEach((r) => {
    r.inset(5);
    hatch(r);
  });
};

function hatch(r) {
  const v_chance = random();
  const h_chance = random();
  const v_pack = random(1, 12);
  const h_pack = random(1, 12);
  stroke(0, 0, 0.8);

  const squares = pow(2, floor(random(1, 4)));
  let rects = r.partition(squares, squares);

  rects.forEach((r) => {
    r.inset(1);

    if (random() < v_chance) {
      hatchVertical(r, v_pack);
    }

    if (random() < h_chance) {
      hatchHorizontal(r, h_pack);
    }
  });
}

function hatchVertical(r, pack) {
  for (let x = pack * 0.5; x < r.w; x += pack) {
    noiseyLine(r.l + x, r.t, r.l + x, r.t + r.h);
  }
}

function hatchHorizontal(r, pack) {
  for (let y = pack * 0.5; y < r.h; y += pack) {
    noiseyLine(r.l, r.t + y, r.l + r.w, r.t + y);
  }
}

function noiseyLine(x1, y1, x2, y2, n = 10) {
  x1 += noise(x1, y1, 0) * n - 0.5;
  y1 += noise(x1, y1, 1) * n - 0.5;
  x2 += noise(x1, y1, 2) * n - 0.5;
  y2 += noise(x1, y1, 3) * n - 0.5;

  line(x1, y1, x2, y2);
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
