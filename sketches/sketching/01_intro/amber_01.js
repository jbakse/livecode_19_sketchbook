// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Amber Hurwitz

window.setup = function () {
  createCanvas(720, 480);
  frameRate(12);
  background(220);
  strokeWeight(1.5);

  // Repeat.
  loop();
};

window.draw = function () {
  // Draw a circle of a random
  // size at a random location
  // on the page.
  const s = random(30, 100);
  const x = random(s, width - s);
  const y = random(s, height - s);

  noFill();
  stroke(30);
  ellipse(x, y, s, s);

  // Draw a dot in the center of
  // the circle.
  noStroke();
  fill(30);
  ellipse(x, y, 3, 3);

  // Draw a varying number of
  // lines, of varying lengths,
  // radiating out from the
  // center of the circle.
  noFill();
  stroke(30);
  const c = floor(random(5, 15));
  for (let i = 0; i < c; i++) {
    const a = map(i, 0, c, 0, 2 * PI);
    const l = random(s * 0.5, s);
    line(
      //
      x + sin(a) * 10,
      y + cos(a) * 10,
      x + sin(a) * l,
      y + cos(a) * l
    );
  }
};
