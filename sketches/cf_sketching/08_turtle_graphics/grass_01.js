// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js
// require http://compform.net/turtles/turtle/turtle.js

function setup() {
  createCanvas(500, 500);
  background(0, 50, 0);
}


function draw() {
  background(0, 0, 0);


  for (y = 1; y < 5; y++) {
    for (x = 1; x < 5; x++) {
      drawSprout(y * 100, x * 110, -90, 50, random(50, 250));
    }
  }

  noLoop();
}

let id = 0;

function drawSprout(x, y, a, length, g) {
  let thisID = id++;

  push();


  const t = new Turtle(x, y);
  t.turnTo(a);

  strokeCap(ROUND);

  let turn = random(-0, 0);
  let deltaTurn = random(-.5, .5);
  stroke(0, g, 0);
  for (let i = 0; i < length; i++) {
    strokeWeight(mapEaseIn(i, length - 25, length, 10, 0, true));
    turn += deltaTurn;

    if (turn > 5) {
      deltaTurn = -abs(deltaTurn);

    }
    if (turn < -5) {
      deltaTurn = abs(deltaTurn);

    }

    t.moveForward(2);
    t.turnLeft(turn);

    if ((i === length * .3) && length > 25) {

      drawSprout(t.x, t.y, degrees(t.bearingRadians), length * .5, g * .75);
    }
  }
  pop();
}



function mapEaseIn(v, inMin, inMax, outMin, outMax, shouldClamp) {
  let n = (v - inMin) / (inMax - inMin);
  if (shouldClamp) {
    n = clamp(n, 0, 1);
  }
  let easeN = n * n;
  let out = easeN * (outMax - outMin) + outMin;
  return out;
}


function clamp(value, min, max) {
  if (min > max) {
    // neat, thanks es6!
    [min, max] = [max, min];
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
