// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// a small p5.Graphics for drawing the faces into
let face;

function setup() {
  console.log("P5.VERSION:", p5.VERSION);

  // make a small canvas
  // use WEBGL + noSmooth() to get non antialiased shapes and lines
  pixelDensity(1);
  const c = createCanvas(192, 108, WEBGL);
  noSmooth();

  // scale the canvas up, without antialiasing
  const canvas = document.getElementById("defaultCanvas0");
  canvas.style = "width: 950px; height: 540px; image-rendering: pixelated";

  // configure P5
  noLoop();
  angleMode(DEGREES);

  // set up the p5.Graphics we'll use for drawing the faces
  face = createGraphics(16, 20, WEBGL);
  face.pixelDensity(1);
  face.noSmooth();
  face.noFill();
  face.noStroke();
  face.angleMode(DEGREES);
}

function draw() {
  // figure out our composition
  const photoLocations = planPhotoLocations();

  // we don't need depth testing
  // we want everything we draw to be on top of everything else
  // just like drawing in P2D
  drawingContext.disable(drawingContext.DEPTH_TEST);
  background(50);

  // in WEBGL mode 0,0 is in the center of the canvas
  // move it to the upper left corner, like P2D mode
  translate(width * -0.5, height * -0.5);

  // draw pinholes
  times(500, () => {
    fill(random([20, 40, 60]));
    noStroke();
    rect(random(width), random(height), 1, 1);
  });

  // run through our locations and draw a document at each location
  for (loc of photoLocations) {
    push();
    translate(loc.x, loc.y);
    drawDocument(20, 24);
    pop();
  }

  // draw strings
  push();

  times(2, () => {
    const start = random(photoLocations);

    times(random(3, 10), () => {
      const end = random(photoLocations);
      // shadow
      stroke(0, 150);
      line(start.x, start.y + 1, end.x, end.y + 1);
      // string
      stroke("red");
      line(start.x, start.y, end.x, end.y);
    });
  });
  pop();
}

function planPhotoLocations() {
  // start by arranging the photos in a grid
  const photoLocations = populateGrid(
    { x: 0, y: 0, w: width, h: height },
    8,
    4
  );

  // offset each photo by a random amount
  photoLocations.forEach((loc) => (loc.x += random(-10, 10)));
  photoLocations.forEach((loc) => (loc.y += random(-10, 10)));

  // reorder the locations so the photos "stack" randomly
  shuffle(photoLocations);

  return photoLocations;
}

function drawDocument(w, h) {
  push();

  // configure p5
  rectMode(CENTER);
  noStroke();

  // rotate the document a bit
  rotate(middleRandom(-20, 20));

  // shadow
  fill(0, 0, 0, 100);
  rect(0, 1, w + 2, h + 2);

  // paper
  fill(255);
  rect(0, 0, w, h);

  // content
  if (random() < 0.65) {
    drawText(w - 4, h - 4);
  } else {
    drawFace();
  }

  times(3, () => {
    if (random() < 0.5) {
      push();
      translate(random(-10, 10), random(-10, 10));
      rotate(middleRandom(-20, 20));
      drawPostIt(6, 6);
      pop();
    }
  });

  pop();
}

function drawPostIt(w, h) {
  push();

  // shadow
  fill(0, 50);
  rect(1, 1, w, h);

  // paper
  fill(random(["pink", "yellow", "yellow"]));
  rect(0, 0, w, h);

  // text
  drawText(w - 4, h - 4);

  pop();
}

// drawText
// draws black line to represent some text
// fills a w x h rectangle centered on the current 0,0
// to position the text, translate() before you call

function drawText(w, h) {
  push();

  // configure p5
  noFill();

  // move to the upper left hand of our rectangle
  translate(-w * 0.5, -h * 0.5);

  for (let y = 0; y < h; y += 3) {
    // draw highlight
    if (random() < 0.25) {
      stroke("yellow");
      strokeWeight(2);
      line(random(1, w), y, w - random(1, w), y);
    }

    // draw line
    if (random() < 0.9) {
      stroke("black");
      strokeWeight(1);
      line(0, y, w - random(0, w * 0.5), y);
    }
  }

  pop();
}

// drawSuspect
// draws a face into the `face` p5.Graphics and then draws
// that onto the main canvas
// reuses the same p5.Graphics object to draw each face, so
// the size is not configurable
// to position the suspect, translate() before you call

function drawFace() {
  const w = 16;
  const h = 20;

  // define our limited palette
  const white = 255;
  const lightGray = 200;
  const midGray = 150;
  const darkGray = 100;
  const darkerGray = 50;
  const black = 0;

  face.drawingContext.disable(face.drawingContext.DEPTH_TEST);
  face.push();

  // draw background
  face.background(random([darkGray, lightGray]));

  // offset our face in the frame
  face.translate(random(-3, 3), random(-3, 3));

  // hair
  face.fill(random([lightGray, midGray, darkGray, darkerGray]));
  // upper hair
  if (random() < 0.75) {
    face.ellipse(0, -3, 12, 10);
  }
  // lower hair
  if (random() < 0.5) {
    face.ellipse(0, +3, 12, 10);
  }

  // shirt
  face.fill(random([50, midGray, darkerGray]));
  face.ellipse(0, 10, 22, 15);

  // head shadow
  face.fill(0, 50);
  face.ellipse(0, 2, 12, 15);

  // head
  face.fill(random([lightGray, lightGray, lightGray, darkGray]));
  face.ellipse(0, 0, 12, 12);

  // highlights
  face.fill(255, 60);
  face.ellipse(0, -4, 8, 3); // forehead
  face.ellipse(0, 1, random(1, 3), random(2, 5)); // nose
  face.ellipse(-4, +1, 2, 2); // left cheek
  face.ellipse(+4, +1, 3, 3); // right cheek

  // shadows
  face.fill(0, 30);
  face.ellipse(0, 2, 2, 1); // under nose
  face.ellipse(0, 5, random(3, 4), random(2, 3)); // chin

  // mouth
  face.fill(0, 60);
  face.ellipse(0, 3, random(3, 5), random(1, 2)); // mouth

  // eyes
  face.fill(white);
  face.ellipse(-2, -1, 3, 2);
  face.ellipse(+2, -1, 3, 2);

  // irises
  const eyeColor = random([midGray, darkGray]);
  const shift = random(-1, 1);
  face.fill(eyeColor);
  face.ellipse(-2 + shift, -1, 1.5, 1.5);
  face.ellipse(+2 + shift, -1, 1.5, 1.5);

  face.pop();

  // set things up so that drawing face into the main canvas won't
  // use bilinear filtering (make it jaggy!)
  p5.instance._curElement.getTexture(face).setInterpolation(NEAREST, NEAREST);

  // draw the `face` onto the main canvas
  push();
  imageMode(CENTER);
  image(face, 0, 0);
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