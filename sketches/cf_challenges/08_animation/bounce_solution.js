// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js

/*exported setup draw */

function setup() {
  createCanvas(400, 400);
  frameRate(60);
}

function draw() {
  background("gray");

  stroke("white");
  noFill();
  line(0, 300, 400, 300);

  noStroke();
  fill("black");

  const a = map(millis(), 0, 500, 0, PI);
  let offset = sin(a) * 100;
  offset = abs(offset);
  const y = 250 - offset;
  const x = map(millis() % 2000, 0, 2000, -50, 450);

  ellipse(x, y, 100, 100);
}
