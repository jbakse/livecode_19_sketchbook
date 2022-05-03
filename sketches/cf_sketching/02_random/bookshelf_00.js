// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

class Rectangle {
  constructor(_x, _y, _w, _h) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
  }

  splitLeft(split) {
    const r1 = new Rectangle(this.x, this.y, this.w * split, this.h);
    const r2 = new Rectangle(
      this.x + this.w * split,
      this.y,
      this.w * (1 - split),
      this.h
    );
    return [r1, r2];
  }

  splitTop(split) {
    const r1 = new Rectangle(this.x, this.y, this.w, this.h * split);
    const r2 = new Rectangle(
      this.x,
      this.y + this.h * split,
      this.w,
      this.h * (1 - split)
    );

    return [r1, r2];
  }

  sliceDown(sliceCount) {
    const sliceHeight = this.h / sliceCount;
    const slices = [];

    for (let i = 0; i < sliceCount; i++) {
      slices.push(
        new Rectangle(this.x, this.y + i * sliceHeight, this.w, sliceHeight)
      );
    }
    return slices;
  }

  sliceRight(sliceCount) {
    const sliceWidth = this.w / sliceCount;
    const slices = [];

    for (let i = 0; i < sliceCount; i++) {
      slices.push(
        new Rectangle(this.x + i * sliceWidth, this.y, sliceWidth, this.h)
      );
    }
    return slices;
  }

  inset(amount) {
    this.x += amount;
    this.y += amount;
    this.w -= 2 * amount;
    this.h -= 2 * amount;
  }

  bottom() {
    return this.y + this.h;
  }
}
const bookshelf = new Rectangle(100, 10, 300, 490);
let wood;

function setup() {
  createCanvas(500, 500);
  noLoop();
  wood = color(255, 100, 0);
  noiseDetail(1);
}

function draw() {
  background(50, 50, 50);
  noStroke();

  // draw outer case wood
  fill(wood);
  drawRectangle(bookshelf);
  bookshelf.inset(10);
  bookshelf.h += 10;
  fill(0, 0, 0, 100);
  drawRectangle(bookshelf);

  const shelves = bookshelf.sliceDown(5);

  shelves.forEach((shelf) => {
    const space = new Rectangle(shelf.x, shelf.y, shelf.w, shelf.h - 10);
    fillSpace(space);
    fill(0, 0, 0, 50);
    rect(shelf.x, shelf.y, shelf.w, 10);
    rect(shelf.x, shelf.y, shelf.w, 20);
    rect(shelf.x, shelf.y, shelf.w, 30);

    fill(wood);
    rect(shelf.x, shelf.y + shelf.h, shelf.w, -10);
  });
}

function fillSpace(space) {
  fillSpaceBooks(space);
}

function fillSpaceBooks(space) {
  const bookWidth = random(10, 15);
  const bookCount = floor(space.w / bookWidth);

  const bookRects = space.sliceRight(bookCount);

  let spaceHeight = random(0.25);
  bookRects.forEach((bookRect) => {
    if (random() < 0.5) {
      spaceHeight = random(0.25);
    }
    let [space, book] = bookRect.splitTop(spaceHeight);
    drawBook(book);
  });
}

function drawRectangle(r) {
  rect(r.x, r.y, r.w, r.h);
}

function drawBook(r) {
  const colorFreq = 0.1;
  push();
  colorMode(HSB, 1);
  fill(noise(0, r.y * colorFreq) * 2, 1, 1);
  drawRectangle(r);

  // text
  const textTop = random(0.2, 0.4) * r.h;
  const textBottom = random(0.5, 0.8) * r.h;
  noFill();
  if (random() < 0.8) {
    fill(1, 0, 1);
  }
  if (random() < 0.2) {
    fill(1, 0, 0);
  }

  for (let y = textTop; y < textBottom; y += 4) {
    let width = random() < 0.25 ? 0.5 : 0.25;
    rect(r.x + r.w * 0.75, r.y + y, r.w * -width, 2);
  }

  // bottom flair
  if (random() < 0.1) {
    fill(noise(0, r.y * colorFreq, 0.5) * 2, 1, 1);
    rect(r.x, r.y + r.h, r.w, -10);
  }
  pop();
}

function keyPressed() {
  if (key === "S") {
    save("canvas.jpg");
  }
}
