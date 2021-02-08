// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(512, 512);
  frameRate(2);
  draw();
}

function draw() {
  background(255);
  let positions = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 200, y: 0 },
    { x: 300, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
  ];
  positions = shuffle(positions);
  terrain(positions[0].x, positions[0].y);
  terrain(positions[1].x, positions[1].y);
  terrain(positions[2].x, positions[2].y);
  terrain(positions[3].x, positions[3].y);
}

function terrain(left, top) {
  for (let x = left; x < left + 100; x += 10) {
    for (let y = top; y < top + 100; y += 10) {
      n = noise(x, y);
      let w = n / 0.1 + 2;
      ellipse(x, y, w, w);
      fill(255, 0, 0);
    }
  }
}
