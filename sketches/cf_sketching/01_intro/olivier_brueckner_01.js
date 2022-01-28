// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Zora Wan

// 1. Draw a square with your pencil considerably smaller than your paper.
// 2 Draw a half-circle with colored pen using the center point of the aquare as the circle's center point. It starts from the left mid-point of the square edge, touching the upper edge's mid point, an finally ending in the right edg's mid point.
// 3. draw another square of the same size with your pencil or pen, using a corner of one of the the previous squares as the center point of the new square.
// 4. repeat 2-3 until you are satisfied with your sketch.

const cornerHistory = new Set();

window.setup = () => {
  pixelDensity(2);
  createCanvas(600, 600);

  angleMode(DEGREES);
  noLoop();
};

window.draw = () => {
  background(240);

  noFill();
  strokeWeight(2);

  blendMode(MULTIPLY);
  stroke(30, 30, 190);

  cornerHistory.add({ x: 300, y: 300 });

  for (let i = 0; i < 100; i++) {
    push();
    const corner = pick([...cornerHistory]);
    translate(corner.x, corner.y);
    drawFigure(100);

    cornerHistory.delete(corner);
    cornerHistory.add({
      x: corner.x + 50,
      y: corner.y + 50,
    });
    cornerHistory.add({
      x: corner.x - 50,
      y: corner.y + 50,
    });
    cornerHistory.add({
      x: corner.x + 50,
      y: corner.y - 50,
    });
    cornerHistory.add({
      x: corner.x - 50,
      y: corner.y - 50,
    });

    pop();
  }
};

function drawFigure(w) {
  push();
  {
    translate(random(-2, 2), random(-2, 2));
    rotate(random(-2, 2));
    rectMode(CENTER);
    rect(0, 0, w, w);
    arc(0, 0, w, w, -180, 0);
  }
  pop();
}

function pick(arr) {
  return arr[floor(random(arr.length))];
}
