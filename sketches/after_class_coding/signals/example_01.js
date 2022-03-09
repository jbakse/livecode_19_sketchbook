// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(512, 512);
  fill("red");
  noStroke();
}

function draw() {
  background("black");
  ellipse(
    width * 0.5,
    sin((frameCount / 60) * TWO_PI) * height * 0.25 + height * 0.5,
    100,
    100
  );
}
