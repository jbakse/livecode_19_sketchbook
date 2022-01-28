// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Zora Wan

// 1. Draw a any size square
// 2. Pick any side of the square and use it as a diagonal to draw the second square.(the diagonal can be =< a side of the square)
// 3. Pick a side from the second square inside of the first square and repeat step2.
// 4. Repeat Step3 untill there is no space to draw a new square.

window.setup = () => {
  pixelDensity(2);
  createCanvas(600, 600);

  angleMode(DEGREES);
  noLoop();
};

window.draw = () => {
  background(250);

  noFill();
  strokeWeight(2);

  translate(width * 0.5, height * 0.5);

  blendMode(MULTIPLY);

  stroke(30, 30, 190);
  drawFigure(400);

  stroke(190, 30, 30);
  drawFigure(400);
};

function drawFigure(w) {
  if (w < 10) return;
  push();
  {
    rectMode(CENTER);
    rect(0, 0, w, w);
    const direction = pick(directions);
    translate(w * 0.5 * direction[0], w * 0.5 * direction[1]);
    rotate(45);
    drawFigure(w * sqrt(2) * 0.5);
  }
  pop();
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function pick(arr) {
  return arr[floor(random(arr.length))];
}
