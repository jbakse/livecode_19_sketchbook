// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js
// require http://compform.net/turtles/turtle/turtle.js

/* exported setup draw */
/* globals Turtle */

let t;
function setup() {
  createCanvas(500, 500);
  t = new Turtle();
  noLoop();
}

function draw() {
  background(180, 200, 230);

  // tail
  push();
  // position and rotate the whole thing, because it isn't where i wanted it
  translate(290, 400);
  rotate(PI);
  for (let i = 45; i > 6; i--) {
    t.pushState();
    t.penUp();
    t.moveTo(0, i * 8);
    t.turnTo(0);
    t.penDown();
    drawFeatherRing(i);
    t.popState();
  }
  pop();
}

function drawFeatherRing(steps = 10) {
  t.pushState();
  t.turnLeft(90);
  t.penUp();
  t.moveForward(((steps * 80) / PI) * 0.5);
  t.penDown();
  t.turnRight(90);
  for (let i = 0; i < steps; i++) {
    t.turnLeft((360 / steps) * 0.5);
    drawColorFeather();
    t.turnRight((360 / steps) * 0.5);
    t.penUp();
    t.moveForward(80);
    t.penDown();
    t.turnRight(360 / steps);
  }
  t.popState();
}
function drawColorFeather() {
  stroke("#ff0");
  strokeWeight(5);
  for (let a = 0; a < 11; a++) {
    drawFeather(a * 8.5);
  }

  stroke("#3a0");
  strokeWeight(noise(t.x * 0.01, t.y * 0.01, 1) * 3 + 1);
  //   strokeWeight(3);
  for (let a = 0; a < 11; a++) {
    drawFeather(a * 8.5);
  }

  stroke("#03f");
  strokeWeight(1);
  for (let a = 0; a < 11; a++) {
    drawFeather(a * 8.5);
  }
}

function drawFeather(angle = 45) {
  push();
  t.pushState();

  t.turnRight(angle);
  const steps = 20;
  for (let i = 0; i < steps * 0.5; i++) {
    t.moveForward(10);
    t.turnRight((360 - angle * 4) / steps);
  }
  t.turnRight(angle * 2);
  for (let i = 0; i < steps * 0.5; i++) {
    t.moveForward(10);
    t.turnRight((360 - angle * 4) / steps);
  }
  t.popState();
  pop();
}

function noiseInt(a, b, c, min, max) {
  return floor(noiseFloat(a, b, c, min, max));
}

function noiseFloat(a, b, c, min, max) {
  push();
  noiseDetail(2, 0.5);
  const n = noise(a, b, c);
  pop();
  return map(n, 0, 0.75, min, max);
}

function randomInt(a, b) {
  return floor(random(a, b));
}

// function mapEaseIn(v, inMin, inMax, outMin, outMax, shouldConstrain) {
//   let n = (v - inMin) / (inMax - inMin);
//   if (shouldConstrain) {
//     n = constrain(n, 0, 1);
//   }
//   const easeN = n * n;
//   const out = easeN * (outMax - outMin) + outMin;
//   return out;
// }
