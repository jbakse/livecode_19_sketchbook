// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let g;
let gl;
let face;
let faceGL;

function setup() {
  pixelDensity(1);
  const c = createCanvas(192, 108);
  c.style("width", "950px");
  c.style("height", "540px");
  c.style("image-rendering", "pixelated");
  noSmooth();
  noLoop();
  angleMode(DEGREES);

  g = createGraphics(192, 108, WEBGL);
  g.pixelDensity(1);
  g.noSmooth();
  g.noFill();
  g.noStroke();
  g.angleMode(DEGREES);
  gl = g.canvas.getContext("webgl");

  g.translate(-width / 2, -height / 2);

  face = createGraphics(16, 20, WEBGL);
  face.pixelDensity(1);
  face.noSmooth();
  face.noFill();
  face.noStroke();
  face.angleMode(DEGREES);
  faceGL = g.canvas.getContext("webgl");
}

function draw() {
  const photoLocations = populateGrid(
    { x: 0, y: 0, w: width, h: height },
    8,
    4
  );

  photoLocations.forEach((loc) => (loc.x += random(-10, 10)));
  photoLocations.forEach((loc) => (loc.y += random(-10, 10)));

  shuffle(photoLocations);

  gl.disable(gl.DEPTH_TEST);
  g.background(50);
  for (loc of photoLocations) {
    g.push();
    g.translate(loc.x, loc.y);
    drawDocument(20, 24);
    g.pop();
  }

  // strings
  g.push();

  times(random(2), () => {
    const start = random(photoLocations);
    times(random(5, 15), () => {
      const end = random(photoLocations);
      g.stroke("red");
      g.line(start.x, start.y, end.x, end.y);
      g.stroke(0, 100);
      g.line(start.x, start.y + 1, end.x, end.y + 1);
    });
  });
  g.pop();

  image(g, 0, 0, width, height);
}

function drawDocument(w, h) {
  g.push();
  g.rectMode(CENTER);
  g.noStroke();

  g.rotate(middleRandom(-20, 20));

  // shadow
  g.fill(0, 0, 0, 100);
  g.rect(0, 1, w + 2, h + 2);

  // paper
  g.fill(255);
  g.rect(0, 0, w, h);

  // content
  if (random() < 0.75) {
    drawText(w, h);
  } else {
    drawSuspect(w - 4, h - 4);
  }

  times(3, () => {
    if (random() < 0.5) {
      g.translate(random(-10, 10), random(-10, 10));
      g.rotate(middleRandom(-20, 20));
      g.fill(0, 0, 0, 50);
      g.rect(1, 1, 7, 7);

      g.fill(random(["pink", "yellow", "yellow"]));
      g.rect(0, 0, 6, 6);

      drawText(10, 10);
    }
  });

  g.pop();
}

function drawSuspect(w, h) {
  //   const face = createGraphics(w, h, WEBGL);
  faceGL.disable(gl.DEPTH_TEST);
  face.push();
  face.background(random(100, 200));
  face.translate(-8, -10);

  face.noStroke();
  const tx = random(-3, 3);
  const ty = random(-3, 3);
  face.translate(tx, ty);

  //   // background detail
  //   //   g.stroke("black");
  //   //   g.strokeWeight(5);
  //   //   g.line(random(-w), random(-h), random(w), random(h));
  //   //   g.noStroke();

  // hair
  face.fill(random([200, 150, 100, 50]));
  if (random() < 0.75) {
    face.ellipse(w * 0.5, h * 0.5 - 3, w * 0.8, h * 0.7);
  }
  if (random() < 0.5) {
    face.ellipse(w * 0.5, h * 0.5 + 3, w * 0.8, h * 0.7);
  }
  // shirt
  face.fill(random([50, 200, 100]));
  face.ellipse(w * 0.5, h * 0.5 + 10, w * 1.3, h * 0.7);

  // head
  face.fill(0, 50);
  face.ellipse(w * 0.5, h * 0.5 + 2, w * 0.7, h * 0.7);
  face.fill(random([200, 200, 200, 100]));
  face.ellipse(w * 0.5, h * 0.5, w * 0.6, h * 0.6);

  // face
  const s = random(-1, 1);
  const leftEye = random() < 9.5;
  const rightEye = random() < 9.5;
  const eyeColor = random([130, 100]);
  face.fill(240);
  if (leftEye) face.ellipse(w * 0.5 - 2, h * 0.5 - 1, 3, 2);
  if (rightEye) face.ellipse(w * 0.5 + 2, h * 0.5 - 1, 3, 2);

  //   if (leftEye)
  //     face.set(w * 0.5 - 2 + s + tx, h * 0.5 - 1 + ty, color(eyeColor)); // left eye
  //   if (rightEye)
  //     face.set(w * 0.5 + 2 + s + tx, h * 0.5 - 1 + ty, color(eyeColor)); // right eye
  //   face.updatePixels();

  face.fill(255, 60);
  face.ellipse(w * 0.5 + 0, h * 0.5 - 4, 6, 2); // forehead
  face.ellipse(w * 0.5 + 0, h * 0.5 + 1, 2, random(2, 5)); // nose
  face.ellipse(w * 0.5 - 2, h * 0.5 + 1, 2, 2); // left cheek
  face.ellipse(w * 0.5 + 2, h * 0.5 + 1, 2, 2); // right cheek
  face.fill(0, 30);
  face.ellipse(w * 0.5 + 0, h * 0.5 + 2, 2, 1); // under nose
  face.ellipse(w * 0.5 + 0, h * 0.5 + 4, random(3, 4), random(2, 3)); // chin
  face.fill(0, 60);
  face.ellipse(w * 0.5 + 0, h * 0.5 + 3, random(3, 5), random(0, 2)); // mouth

  face.pop();
  g.push();
  //   translate(-w * 0.5, -h * 0.5);
  g.imageMode(CENTER);
  g.noSmooth();
  g.image(face, 0, 0);
  g.pop();
}

function drawText(w, h) {
  g.push();
  g.stroke("black");
  g.translate(-w * 0.5, -h * 0.5);
  for (let y = 3; y < h - 2; y += 3) {
    if (random() < 0.25) {
      g.push();
      g.stroke("yellow");
      g.strokeWeight(2);
      g.line(random(1, 10), y, w - random(1, 10), y);
      g.pop();
    }
    if (random() < 0.9) {
      g.line(3, y, w - 3 - random(0, 3), y);
    }
  }

  g.pop();
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

function middleRandom(min, max, rolls = 2) {
  let v = 0;
  for (let roll = 0; roll < rolls; roll++) {
    v += random(min, max);
  }
  return v / rolls;
}

function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
