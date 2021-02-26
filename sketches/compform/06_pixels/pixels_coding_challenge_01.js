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

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      // edit below
      const id = row * 10 + col;
      const x = 50 + col * 50;
      const y = 50 + row * 50;
      // edit above

      fill("#ccc");
      ellipse(x, y, 40, 40);
      fill("black");
      text(id, x, y);
    }
  }
}
