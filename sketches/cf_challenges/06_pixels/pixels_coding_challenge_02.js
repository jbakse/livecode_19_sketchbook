// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
/* exported setup draw */

function setup() {
  createCanvas(550, 550);
  noLoop();
}

function draw() {
  background(100);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);

  for (let id = 0; id < 100; id++) {
    // edit below
    const col = id % 10;
    const row = floor(id / 10);
    const x = 50 + col * 50;
    const y = 50 + row * 50;
    // edit above

    fill("#ccc");
    ellipse(x, y, 40, 40);
    fill("black");
    text(id, x, y);
  }
}
