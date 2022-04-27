// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// i liked the pixel shelf, now a pixel suspect/conspiracy board

/* exported setup draw */

function setup() {
  pixelDensity(1);
  const c = createCanvas(192, 108);
  c.style("width", "950px");
  c.style("height", "540px");
  c.style("image-rendering", "pixelated");
  noSmooth();
  noLoop();
  angleMode(DEGREES);
}

function draw() {
  background("black");

  const photoLocations = populateGrid(
    { x: 0, y: 0, w: width, h: height },
    8,
    5
  );

  photoLocations.forEach((loc) => (loc.x += random(-10, 10)));
  photoLocations.forEach((loc) => (loc.y += random(-10, 10)));

  shuffle(photoLocations);

  for (loc of photoLocations) {
    push();
    translate(loc.x, loc.y);
    drawDocument(20, 25);
    pop();
  }

  // strings
  push();
  stroke("red");
  times(random(2), () => {
    const start = random(photoLocations);
    times(random(5, 15), () => {
      const end = random(photoLocations);
      console.log(start, end);
      line(start.x, start.y, end.x, end.y);
    });
  });
  pop();
}

function populateGrid(rect, cols, rows) {
  const points = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      points.push({
        x: rect.x + (rect.w / cols) * (col + 0.5),
        y: rect.y + (rect.h / rows) * (row + 0.5),
      });
    }
  }
  return points;
}

function drawDocument(w, h) {
  push();
  rotate(middleRandom(-20, 20));

  rectMode(CENTER);
  noStroke();

  fill(0, 0, 0, 40);
  rect(0, 1, w + 2, h + 2);
  fill("white");
  rect(0, 0, w, h);

  if (random() < 0.75) {
    drawText(w, h);
  } else {
    drawSuspect(w - 4, h - 4);
  }

  pop();
}

function drawSuspect(w, h) {
  const g = createGraphics(w, h);
  g.background(random(100, 200));
  g.noStroke();
  const tx = random(-3, 3);
  const ty = random(-3, 3);
  g.translate(tx, ty);

  // background detail
  //   g.stroke("black");
  //   g.strokeWeight(5);
  //   g.line(random(-w), random(-h), random(w), random(h));
  //   g.noStroke();

  // hair
  g.fill(random([200, 150, 100, 50]));
  if (random() < 0.75) {
    g.ellipse(w * 0.5, h * 0.5 - 3, w * 0.8, h * 0.7);
  }
  if (random() < 0.5) {
    g.ellipse(w * 0.5, h * 0.5 + 3, w * 0.8, h * 0.7);
  }
  // shirt
  g.fill(random([50, 200, 100]));
  g.ellipse(w * 0.5, h * 0.5 + 10, w * 1.3, h * 0.7);

  // head
  g.fill(0, 50);
  g.ellipse(w * 0.5, h * 0.5 + 2, w * 0.7, h * 0.7);
  g.fill(random([200, 200, 200, 100]));
  g.ellipse(w * 0.5, h * 0.5, w * 0.6, h * 0.6);

  // face
  const s = random(-1, 1);
  const leftEye = random() < 9.5;
  const rightEye = random() < 9.5;
  const eyeColor = random([130, 100]);
  g.fill(240);
  if (leftEye) g.ellipse(w * 0.5 - 2, h * 0.5 - 1, 3, 2);
  if (rightEye) g.ellipse(w * 0.5 + 2, h * 0.5 - 1, 3, 2);

  if (leftEye) g.set(w * 0.5 - 2 + s + tx, h * 0.5 - 1 + ty, color(eyeColor)); // left eye
  if (rightEye) g.set(w * 0.5 + 2 + s + tx, h * 0.5 - 1 + ty, color(eyeColor)); // right eye
  g.updatePixels();

  g.fill(255, 60);
  g.ellipse(w * 0.5 + 0, h * 0.5 - 4, 6, 2); // forehead
  g.ellipse(w * 0.5 + 0, h * 0.5 + 1, 2, random(2, 5)); // nose
  g.ellipse(w * 0.5 - 2, h * 0.5 + 1, 2, 2); // left cheek
  g.ellipse(w * 0.5 + 2, h * 0.5 + 1, 2, 2); // right cheek
  g.fill(0, 30);
  g.ellipse(w * 0.5 + 0, h * 0.5 + 2, 2, 1); // under nose
  g.ellipse(w * 0.5 + 0, h * 0.5 + 4, random(3, 4), random(2, 3)); // chin
  g.fill(0, 60);
  g.ellipse(w * 0.5 + 0, h * 0.5 + 3, random(3, 5), random(0, 2)); // mouth

  push();
  //   translate(-w * 0.5, -h * 0.5);
  imageMode(CENTER);
  image(g, 0, 0);
  pop();
}
function drawText(w, h) {
  push();
  stroke("black");
  translate(-w * 0.5, -h * 0.5);
  for (let y = 3; y < h - 2; y += 3) {
    if (random() < 0.9) {
      line(3, y, w - 3 - random(0, 3), y);
    }
    if (random() < 0.25) {
      push();
      stroke("yellow");
      strokeWeight(2);
      blendMode(MULTIPLY);
      line(random(1, 10), y, w - random(1, 10), y);
      pop();
    }
  }

  pop();
}

function middleRandom(min, max, rolls = 2) {
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
function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
