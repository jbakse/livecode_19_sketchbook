// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// i've made this sketch before, but can't find it...

// it draws a pixel bookshelf

/* exported setup draw */

function setup() {
  const c = createCanvas(192 * 2, 108 * 2);
  c.style("width", "100%");
  c.style("height", "auto");
  c.style("image-rendering", "pixelated");
  noSmooth();
  noLoop();
}

function draw() {
  background("black");

  for (let row = 0; row < 4; row++) {
    push();
    translate(0, row * 48 + 4);
    drawShelf(width, 48);
    pop();
  }
}

function drawShelf(w, h) {
  push();
  translate(0, h - 2);
  drawSupport(w, 2);
  pop();

  push();
  drawStuff(w, h - 2);
  pop();
}

function drawSupport(w, h) {
  push();
  noStroke();
  fill("white");
  rect(0, 0, w, h);
  fill("#ddd");
  rect(0, h - 1, w, 1);
  pop();
}
function drawStuff(w, h) {
  const start = 0;
  const end = w;
  let x = start;
  while (x < end) {
    // low bias
    let sectionWidth = min(
      random(0, width * 0.5),
      random(0, width * 0.5),
      random(0, width * 0.5)
    );

    sectionWidth = roundTo(sectionWidth, 8); // apply a grid
    sectionWidth = min(end - x, sectionWidth); // constrain last

    push();
    translate(x, 0);
    drawBooks(sectionWidth, h);
    pop();

    x += sectionWidth;
  }
}
function drawBooks(w, h) {
  const start = 0;
  const end = w;
  let x = start;
  let bookHeight = middleRandom(h * 0.5, h, 5);
  bookHeight = roundTo(bookHeight, 5);
  const colors = ["#222", "#666", "#888", "#aaa", "#c00"];
  const c = color(random(colors));
  let band = false;

  if (random() > 0.6) {
    band = {
      y: random([8, 12, 15]),
      h: random([2, 5, 15]),
      c: random(["white", "black"]),
    };
    band.h = min(band.h, band.y - 1);
  }

  let words = false;
  if (random() > 0.0) {
    words = {
      color: random(["#ccc", "#c00", "black"]),
    };
  }
  const texture = random() < 0.5;
  while (x < end) {
    let bookWidth = middleRandom(5, 10, 2);
    bookWidth = roundTo(bookWidth, 1); // apply a grid
    bookWidth = min(end - x, bookWidth); // constrain last book
    if (end - (x + bookWidth) < 5) bookWidth = end - x;
    push();
    const jitter = random([0, 0, 0, 0, -1, 1]);
    translate(x, h - (bookHeight + jitter));

    drawBook(bookWidth, bookHeight + jitter, c, band, words, texture);
    pop();

    x += bookWidth;
  }
}

function drawBook(w, h, c, band = false, words = false, texture = false) {
  push();
  noStroke();

  // base
  fill(c);
  rect(0, 0, w, h);

  // band
  if (band) {
    fill(band.c);
    rect(0, h - band.y + random([0, 0, 1]), w, band.h);
  }

  // words
  console.log(words);
  if (words) {
    const letterHeights = [0, 2, 2, 2, 2, 3, 3];
    let i = 0;
    const bottom = band ? h - band.y - 2 : h - 2;
    fill(words.color);
    for (let y = random([2, 4, 8, 16]); y < bottom; y += 2) {
      if (i % letterHeights.length === 0) shuffle(letterHeights, true);
      const wordWidth = letterHeights[i % letterHeights.length];

      rect(2, y, min(wordWidth, w - 4), 1);
      i++;
    }
  }

  // tint
  fill(0, random([0, 15, 30]));
  rect(0, 0, w, h);

  // crease
  if (random() < 0.2) {
    // 20% of books have creases
    fill(0, 30);
    rect(randomInt(2, w - 2), 0, 1, h);
    if (random() < 0.8) {
      // 80% of those have multiple creases
      rect(randomInt(2, w - 2), 0, 1, h);
    }
  }

  // texture

  if (texture) {
    fill(0, 10);
    for (let i = 0; i < w * h; i++) {
      rect(randomInt(w), randomInt(h), 1, 1);
    }
  }

  // shadow
  fill(0, 50);
  rect(0, 0, 1, h);

  // higlight
  fill(255, 30);
  rect(w - 1, 0, 1, h);
  rect(0, 0, w, 1);

  // ding
  if (random() < 0.5) {
    fill(0, 0, 0, 200);
    rect(0, 0, 1, 1);
  }

  pop();
}

function middleRandom(min, max, rolls) {
  let v = 0;
  for (let roll = 0; roll < rolls; roll++) {
    v += random(min, max);
  }
  return v / rolls;
}

function roundTo(v, n) {
  return Math.round(v / n) * n;
}

function randomInt(min, max) {
  return floor(random(min, max));
}
