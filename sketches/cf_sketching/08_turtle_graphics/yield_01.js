// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js
// require! http://compform.net/turtles/turtle/turtle.js
// require /sketches/cf_sketching/08_turtle_graphics/turtle.js

/* exported setup draw */
/* globals Turtle */

let t, d;

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  noFill();
  stroke("black");
  strokeWeight(2);
  background(100);
  frameRate(60);

  t = new Turtle();
  d = drawGenerator();
}

function draw() {
  d.next();
}

function* drawGenerator() {
  background("#06a");
  stroke("white");
  yield;

  t.show(true);
  t.penUp();
  t.moveTo(200, 200);
  t.penDown();
  yield* star();

  t.penUp();
  t.moveTo(280, 280);
  t.penDown();
  yield* star();

  t.penUp();
  t.moveTo(width / 2, 420);
  t.penDown();
  for (let i = 0; i < 36; i++) {
    // run the sub-generator all at once
    // [...circle()];
    // run the sub-generator one step at a time
    yield* circle();

    t.moveForward(15);
    t.turnLeft(10);
    t.moveForward(15);

    yield;
  }

  while (true) {
    t.turnRight(random(-30, 30));
    t.moveForward(1);
    yield;
  }
}

function* star() {
  for (let i = 0; i < 5; i++) {
    t.moveForward(100);
    yield;
    t.turnRight(144);
    yield;
  }
}

function* circle(size = 5) {
  for (let i = 0; i < 30; i++) {
    t.moveForward(size);
    t.turnRight(360 / 30);
    if (i % 5 == 0) yield; // yeild just when you want to!
  }
}
