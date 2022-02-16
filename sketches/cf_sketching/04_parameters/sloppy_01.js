// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(512, 512);
  background("black");
  noLoop();
}

function draw() {
  fill("red");
  sloppyRect(100, 100, 100, 100, 10);
}

function sloppyRect(x, y, w, h, slop) {
  stroke("white");
  beginShape();
  vertex(
    x + random(-slop, slop), //
    y + random(-slop, slop)
  );
  vertex(
    x + w + random(-slop, slop), //
    y + random(-slop, slop)
  );
  vertex(
    x + w + random(-slop, slop), //
    y + h + random(-slop, slop)
  );
  vertex(
    x + random(-slop, slop), //
    y + h + random(-slop, slop)
  );
  endShape(CLOSE);
}
