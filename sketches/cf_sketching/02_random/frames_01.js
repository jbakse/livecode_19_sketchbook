// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
    noFill();
    stroke("white");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  grow(amount) {
    this.x -= amount;
    this.y -= amount;
    this.w += 2 * amount;
    this.h += 2 * amount;
  }

  intersects(r2) {
    return !(
      r2.x > this.x + this.w ||
      r2.x + r2.w < this.x ||
      r2.y > this.y + this.h ||
      r2.y + r2.h < this.y
    );
  }
}

let rects = [];

function setup() {
  createCanvas(960, 540);

  // create retangles
  for (let x = 0; x < width; x += 128) {
    for (let y = 0; y < height; y += 128) {
      const offsetX = random(-64, 64);
      const offsetY = random(-64, 64);
      rects.push(new Rectangle(x + offsetX, y + offsetY, 0, 0));
    }
  }

  // grow the rectangles until they intersect any other rectangle
  while (growRectangles()) {
    // no op
  }

  // shrink the rectangles a bit to create a maring
  rects.forEach((rect) => {
    rect.grow(-10);
  });

  // remove any very small rectangles
  rects = rects.filter((rect) => rect.w > 20 && rect.h > 20);
}

function growRectangles() {
  let somethingGrew = false;
  for (const r1 of rects) {
    const intersction = rects.some((r2) => r1 !== r2 && r1.intersects(r2));
    if (!intersction) {
      r1.grow(1);
      somethingGrew = true;
    }
  }
  return somethingGrew;
}

function draw() {
  background("black");

  rects.forEach((rect) => {
    rect.draw();
  });
}
