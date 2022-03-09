// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(512, 512);
  fill("red");
  noStroke();
}

function draw() {
  background("black");
  for (i = 0; i < 10; i++) {
    ellipse(
      map(i, -1, 10, 0, width),
      sin((frameCount / 60 + i) * TWO_PI + (i / 10) * TWO_PI) * height * 0.25 +
        height * 0.5,
      50,
      50
    );
  }
}
