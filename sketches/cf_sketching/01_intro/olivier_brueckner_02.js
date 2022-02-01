// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Zora Wan

// 1. Draw a square with your pencil considerably smaller than your paper.
// 2 Draw a half-circle with colored pen using the center point of the aquare as the circle's center point. It starts from the left mid-point of the square edge, touching the upper edge's mid point, an finally ending in the right edg's mid point.
// 3. draw another square of the same size with your pencil or pen, using a corner of one of the the previous squares as the center point of the new square.
// 4. repeat 2-3 until you are satisfied with your sketch.

/* 
My second pass at this. The first time I stumbled on using blendMode(MULTIPLY) for all the strokes and liked how it built up like marker on paper and was looking at all the other marker sketches.

This time I tried to really lean in to the marker look. I added some more random mistakes, made sure the blue never built up to full black, and put in some paper grain and a sort of lighting vignette.

Its all pretty subtle, changing the output maybe 10% and probably took about 3 times as long as the original sketch.

*/

const cornerHistory = new Set();
const figureRadius = 100;

window.setup = () => {
  pixelDensity(2);
  createCanvas(1200, 1200);

  angleMode(DEGREES);
  noLoop();
};

window.draw = () => {
  background(255);

  noFill();
  strokeWeight(4);

  blendMode(MULTIPLY);

  cornerHistory.add({ x: 0, y: 0 });

  translate(width * 0.5, height * 0.5);
  rotate(1);
  scale(0.9);

  for (let i = 0; i < 80; i++) {
    push();
    const corner = pick([...cornerHistory]);
    translate(corner.x, corner.y);
    drawFigure(figureRadius * 2);

    cornerHistory.delete(corner);
    cornerHistory.add({
      x: corner.x + figureRadius + j(),
      y: corner.y + figureRadius + j(),
    });
    cornerHistory.add({
      x: corner.x - figureRadius + j(),
      y: corner.y + figureRadius + j(),
    });
    cornerHistory.add({
      x: corner.x + figureRadius + j(),
      y: corner.y - figureRadius + j(),
    });
    cornerHistory.add({
      x: corner.x - figureRadius + j(),
      y: corner.y - figureRadius + j(),
    });

    pop();
  }

  postProcess();
};

function postProcess() {
  loadPixels();
  // loop over width and height

  for (let y = 0; y < height * 2; y++) {
    for (let x = 0; x < width * 2; x++) {
      const c = getQuick(x, y);

      // vignette + warm light
      c[0] -= dist(x, y, 1200, 1200) / 50;
      c[1] -= dist(x, y, 1150, 1150) / 50;
      c[2] -= dist(x, y, 1100, 1000) / 45;

      // papergrain with noise darken
      const n1 = noise(x / 5, y / 20);
      const n2 = noise(x / 10, y / 14, 1);
      const paperGrain = map(n1 * n2, 0, 1, 0.96, 1);
      c[0] *= paperGrain;
      c[1] *= paperGrain;
      c[2] *= paperGrain;

      // min blue to keep build up from going full black
      c[2] = max(c[2], 70);

      setQuick(x, y, c);
    }
  }

  // really sloppy fuzzy bleed blur effect
  for (let n = 0; n < 300000000; n++) {
    const x = randomInt(width * 2);
    const y = randomInt(height * 2);
    const n2 = noise(x / 20, y / 20, 1);

    if (n2 > random()) {
      const x2 = x + 1;
      const y2 = y + 1;
      const c1 = getQuick(x, y);
      const c2 = getQuick(x2, y2);

      // prettier-ignore
      const c3 = [
        (c1[0] + c2[0]) / 2,
        (c1[1] + c2[1]) / 2,
        (c1[2] + c2[2]) / 2,
        255,
      ];

      setQuick(x, y, c3);
      setQuick(x2, y2, c3);
    }
  }
  updatePixels();
}

function getQuick(x, y) {
  const index = constrain(
    (y * width * 2 + x) * 4,
    0,
    width * 2 * height * 2 * 4
  );
  return [
    pixels[index + 0],
    pixels[index + 1],
    pixels[index + 2],
    pixels[index + 3],
  ];
}

function setQuick(x, y, c) {
  const index = constrain(
    (y * width * 2 + x) * 4,
    0,
    width * 2 * height * 2 * 4
  );

  pixels[index + 0] = c[0];
  pixels[index + 1] = c[1];
  pixels[index + 2] = c[2];
  pixels[index + 3] = c[3];
}

function drawFigure(w) {
  push();
  {
    translate(random(-2, 2), random(-2, 2));
    rotate(random(-1, 1));
    markerArc(0, 0, w, w, -180, 0);
    translate(w * -0.5, w * -0.5);
    markerRect(0, 0, w, w);
  }
  pop();
}

function markerRect(x, y, w, h) {
  const l = x;
  const t = y;
  const r = x + w;
  const b = y + h;
  markerLine(l, t, r, t);
  markerLine(r, t, r, b);
  markerLine(r, b, l, b);
  markerLine(l, b, l, t);
}

function markerLine(x1, y1, x2, y2) {
  x1 += j();
  y1 += j();
  x2 += j();
  y2 += j();
  const xA = lerp(x1, x2, -0.5) + random(-20, 20);
  const yA = lerp(y1, y2, -0.5) + random(-20, 20);
  const xB = lerp(x1, x2, -0.5) + random(-20, 20);
  const yB = lerp(y1, y2, -0.5) + random(-20, 20);

  push();
  strokeWeight(random(3, 5));
  stroke(70, 70, 220, random(200, 255)); // blue marker

  curve(xA, yA, x1, y1, x2, y2, xB, yB);

  const heavyStart = random(0.0, 0.1);
  const heavyEnd = random(0.9, 1.0);
  if (random() < 0.25)
    line(x1, y1, lerp(x1, x2, heavyStart), lerp(y1, y2, heavyStart));
  if (random() < 0.25)
    line(lerp(x1, x2, heavyEnd), lerp(y1, y2, heavyEnd), x2, y2);
  pop();
}

function markerArc(x, y, w, h, start, stop) {
  push();
  strokeWeight(random(3, 4));
  stroke(70, 70, 220, random(200, 255)); // blue marker

  // start sloppy, stop sloppy
  const start2 = lerp(start, stop, random(-0.05, 0.1));
  const stop2 = lerp(start, stop, random(0.9, 1.05));

  // main arc
  arc(x, y, w, h, start2, stop2);

  // heavy mark a start and end
  arc(x, y, w, h, start2, lerp(start2, stop2, random(0.0, 0.1)));
  arc(x, y, w, h, lerp(start2, stop2, random(0.9, 1.0)), stop2);
  pop();
}

function j() {
  return random(pick([0, 0, 0, 0, -0.5, -0.5, 0.5, 0.5, -1, 1]));
}

function pick(arr) {
  return arr[floor(random(arr.length))];
}

function randomInt(max) {
  return floor(random(max));
}
