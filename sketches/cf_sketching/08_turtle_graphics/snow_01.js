// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js
// require http://compform.net/turtles/turtle/turtle.js

/* exported setup draw */
/* globals Turtle */

let id;

function setup() {
  createCanvas(500, 500);
}

function draw() {
  const t = new Turtle();

  background(180, 200, 230);
  t.penUp();
  t.moveTo(250, 200);
  t.penDown();

  noFill();
  stroke("white");
  strokeWeight(4);

  id = 0;
  snowMonster(t, 20, 1);
}

function snowMonster(t, stepSize = 20, direction = 1) {
  if (stepSize < 1) return;

  id++;
  const steps = 50;
  const buds = [];
  buds.push(noiseInt(id, 0, 1, 0, steps));
  buds.push(noiseInt(id, 0, 2, 0, steps));
  buds.push(noiseInt(id, 0, 3, 0, steps));
  buds.push(noiseInt(id, 0, 4, 0, steps));

  let mess = 0;
  for (let i = 0; i < steps; i++) {
    t.moveForward(stepSize);
    t.turnRight((360 / steps) * direction);
    t.turnRight(mess);
    mess += 0.3;
    if (buds.includes(i)) {
      t.pushState();
      t.turnRight(sin(frameCount * 0.01) * 10);
      snowMonster(
        t,
        stepSize * 0.5,
        direction * noiseFloat(id, 0, 5, -0.5, -1.5)
      );
      t.popState();
    }
  }
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
