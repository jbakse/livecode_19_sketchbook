// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js
// require http://compform.net/turtles/turtle/turtle.js

function setup() {
  createCanvas(500, 500);
  background(0, 50, 0);
}

function draw() {

  // this takes a minute or so to draw the whole canvas
  // this splits the drawing into bands so you can see progress
  // and so the browser won't timeout
  let startY = (frameCount - 1) * 10;
  let endY = (frameCount) * 10;
  if (endY > 600) {
    noLoop();
  }

  // loop from the top down
  for (y = startY; y < endY; y += .2) {
    // x is plain old random
    let x = random(-50, 550);

    // dA is the curl of the grass
    dA = noiseRange(x * .002, y * .002, 0, -2, 2);
    // ddA is how quickly the curl changes 
    ddA = noiseRange(x * .002, y * .002, 1, -.06, .06);

    // draw shadow
    colorMode(RGB, 255);
    stroke(0, 0, 0, 5);
    strokeWeight(7);
    sprout(x, y, dA, ddA);
    strokeWeight(5);
    sprout(x, y, dA, ddA);

    // draw grass
    colorMode(HSB, 1);
    let saturation = map(y, 0, 500, .5, .8);
    let brightness = map(y, 0, 500, .5, .8);
    brightness += noiseRange(x * .1, y * .01, 0, 0, 1);
    stroke(.3, saturation, brightness, .5);
    strokeWeight(3);
    sprout(x, y, dA, ddA);
  }
}

function noiseRange(x, y, z, min, max) {
  noiseDetail(1);
  const n = noise(x, y, z);
  return map(n, 0, .5, min, max);
}

function sprout(x, y, dA, ddA) {
  push();
  // create a turtle for this blade of grass
  const t = new Turtle(x, y);
  t.turnTo(-90);
  t.penDown();

  // draw the grass in 1 pixel steps
  for (let i = 0; i < 100; i++) {
    dA += ddA;
    dA = clamp(dA, -2, 2);
    t.turnLeft(dA);
    t.moveForward(1);
  }
  pop();
}


function clamp(value, minimum, maximum) {
  if (value < minimum) return minimum;
  if (value > maximum) return maximum;
  return value;
}
