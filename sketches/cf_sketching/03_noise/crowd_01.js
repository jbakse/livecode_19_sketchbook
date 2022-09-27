// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const people = [];

function setup() {
  createCanvas(1920, 1080);
  noiseDetail(4, 0.5);

  repeat(5000, () =>
    people.push({
      x: middleRandom(-width * 0.5, width * 0.5, 2),
      y: highRandom(30, height + -30, 2),
    })
  );

  people.sort((a, b) => (a.y > b.y ? 1 : -1));
  relax(people);
}

function draw() {
  background("white");

  noStroke();
  fill("black");

  translate(width * 0.5, 0);
  people.forEach((person, i) => {
    push();
    const perspective = map(person.y, 0, height, 0.5, 1);

    translate(person.x * perspective, person.y);
    drawPerson(i, perspective);
    pop();
  });
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

function drawPerson(i, s) {
  push();
  scale(s);
  // shadow
  fill(0, 0, 0, 5);
  noStroke();
  ellipse(0, 1, 32, 8);
  ellipse(0, 1, 16, 4);
  // ellipse(0, 1, 10, 5);

  const drawFigure = () => {
    const hipX = noise(i, frameCount * 0.1, 1) * 4 - 2;
    const handY = noise(i, frameCount * 0.1, 2) * 4 - 2;
    const handX = noise(i, frameCount * 0.1, 3) * 4 - 2;
    const headX = noise(i, frameCount * 0.1, 4) * 2 - 1;
    line(0, -20, hipX, -12); // torso
    line(hipX, -12, -3, 0); // left leg
    line(hipX, -12, +3, 0); // right leg
    line(0, -20, -5 + handX, -10 + handY); // left arm
    line(0, -20, 5 - handX, -10 + handY); // right arm
    ellipse(0 + headX, -22, 3, 3); // head
  };

  // "relief"
  noFill();
  stroke("white");
  strokeWeight(3);
  drawFigure();

  // line
  stroke("black");
  strokeWeight(1);
  drawFigure();

  pop();
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
        if (d < min) {
          p2.x += (dX / d) * f;
          p2.y += (dY / d) * f;
        }
      });
    });
  });
}
