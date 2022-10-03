// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const myPoints = [];

function setup() {
  createCanvas(500, 500);
  noiseDetail(4, 0.5);

  repeat(100, () =>
    myPoints.push({
      x: random(width),
      y: random(height),
      r: random(10, 30),
    })
  );
}

function draw() {
  repeat(50, () => {
    relax(myPoints, 2, 1, 1); // can't touch
    for (const p of myPoints) {
      p.x += random(-0.1, 0.1); // heat
      p.y = min(p.y + 0.1, 500); // gravity and floor
      p.x = constrain(p.x, 0, 500); // side walls
    }
  });

  background("white");
  noStroke();
  fill("black");

  for (const p of myPoints) {
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
  }
}

function repeat(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

function highRandom(_min, _max, _bias = 2) {
  const rolls = Array.from({ length: _bias }, () => random(_min, _max));

  const average = rolls.reduce((a, b) => max(a, b));
  return average;
}

function middleRandom(_min, _max, _bias = 2) {
  const rolls = Array.from({ length: _bias }, () => random(_min, _max));

  const average = rolls.reduce((a, b) => a + b) / rolls.length;
  return average;
}

function relax(points, min = 10, f = 1, t = 5) {
  repeat(t, (i) => {
    console.log(`relaxing ${i + 1}/${t}`);
    points.forEach((p1) => {
      points.forEach((p2) => {
        if (p1 === p2) return;

        const dX = p2.x - p1.x;
        const dY = p2.y - p1.y;
        const d = dist(0, 0, dX, dY);
        if (d < min + p1.r + p2.r) {
          p2.x += (dX / d) * f;
          p2.y += (dY / d) * f;
        }
      });
    });
  });
}
