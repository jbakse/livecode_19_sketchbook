// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(1100, 700);

  noLoop();
}

function draw() {
  background(100);
  noStroke();
  textSize(25);
  textAlign(CENTER, CENTER);
  //   scale(10 / 14.5, 10 / 14.5);

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 10; col++) {
      const id = row * 10 + col;
      const x = 100 + col * 100;
      const y = 100 + row * 100;

      if (id < 23) {
        fill("#33ff55");
        ellipse(x, y, 80, 80);
        fill("black");

        text("" + id, x, y);
      } else {
        fill(200);
        if (random() < 0.2) {
          fill("#33ff55");
        }
        ellipse(x, y, 80, 80);
        // fill("white");
        // text("" + id, x, y);
      }
    }
  }
}
