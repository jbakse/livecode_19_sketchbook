// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(480, 480);
  noLoop();
}

function draw() {
  background(50, 60, 120);
  stroke(255);
  strokeWeight(2);
  noFill();
  drawSpiral(240, 240, -5, 30, PI * 0.25);
}

// archimedian

// drawSpiral(x, y, turns, spacing, startAngle)
// drawSpiral(x1, y1, x2, y2, turns) // needs to cacluate spacing based on turns
// drawSpiral(x1, y1, x2, y2, spacing) // needs to calculate turns based on spacing
// drawSpiral(x1, y1, a1, a2, spacing) //number of turns encoded in a2-a1)
// drawSpiral(x1, y1, a1, a2, r()) // pass in a function to determine r
// a2 above could be absolute or relative to a1

function drawSpiral(_x, _y, _turns = 3, _spacing = 10, _a = 0) {
  beginShape();

  for (let a = 0; a < 2 * PI * abs(_turns); a += 0.01) {
    const r = map(a, 0, 2 * PI, 0, _spacing);
    const x = _x + sin(_a + a * Math.sign(_turns)) * r;
    const y = _y + cos(_a + a * Math.sign(_turns)) * r;
    vertex(x, y);
    console.log(x, y);
  }

  endShape();
}
