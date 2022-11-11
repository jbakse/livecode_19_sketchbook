// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js
// require http://compform.net/turtles/turtle/turtle.js

/* exported setup draw */
/* globals Turtle */

let t;
const circles = [];

function setup() {
  createCanvas(500, 500);
  t = new Turtle();

  noLoop();
}

function draw() {
  background("black");
  t.penUp();
  t.moveTo(250, 250);

  noStroke();
  makeBubbles(300);

  filter(BLUR, 5);
  filter(THRESHOLD, 0.5);
  blendMode(SCREEN);
  fill(180, 200, 230);
  rect(0, 0, width, height);
}

function makeBubbles(size) {
  if (size < 5) return;

  const m = 50;
  const s = 0.8;
  fill("white");
  ellipse(t.x + random(-m, m), t.y + random(-m, m), size * s, size * s);
  ellipse(t.x + random(-m, m), t.y + random(-m, m), size * s, size * s);
  ellipse(t.x + random(-m, m), t.y + random(-m, m), size * s, size * s);

  circles.push({ x: t.x, y: t.y, r: size * 0.5 });

  for (let i = 0; i < 30; i++) {
    t.pushState();
    // move to the new position
    t.turnLeft(random(0, 360));
    t.moveForward(size * 0.75);

    const nextSize = size * 0.5;
    // if that spot is clear, draw a bubble
    if (
      circles.every((c) => dist(t.x, t.y, c.x, c.y) > c.r + nextSize * 0.49)
    ) {
      makeBubbles(nextSize);
    }

    t.popState();
  }
}

// function noiseInt(a, b, c, min, max) {
//   return floor(noiseFloat(a, b, c, min, max));
// }

// function noiseFloat(a, b, c, min, max) {
//   push();
//   noiseDetail(2, 0.5);
//   const n = noise(a, b, c);
//   pop();
//   return map(n, 0, 0.75, min, max);
// }

// function randomInt(a, b) {
//   return floor(random(a, b));
// }
