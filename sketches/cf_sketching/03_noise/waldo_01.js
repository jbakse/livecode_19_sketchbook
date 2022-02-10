// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let people = [];

function setup() {
  createCanvas(720, 480);

  people = createLocations();
}

function draw() {
  background("white");

  relax(people); // one step per draw so we can see it happen

  people.forEach(configurePerson);
  people.sort((a, b) => a.y - b.y);
  people.forEach(drawPerson);
}

function createLocations() {
  const points = [];
  // place them on a grid, use noise to sloppy it up
  // some of these will be below the screen
  for (let y = 0; y < width; y += 30) {
    for (let x = 0; x < width; x += 30) {
      points.push({
        x: x + noise(x, y) * 60,
        y: y + noise(x, y) * 60,
      });
    }
  }
  return points;
}

function configurePerson(person) {
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];
  push();
  noiseDetail(2, 0.5); // range will be 0 to .75

  const colorN = noise(person.x * 0.01, person.y * 0.01) / 0.75;

  person.color = colors[floor(colorN * colors.length)];
  pop();
}

function drawPerson(person) {
  stroke("black");

  fill(person.color);

  const x = person.x;
  const y = map(person.y, 0, width, 0, height); // some quick + dirty ortho projection
  ellipse(x, y, 30, 30);
}

// spreads points apart
function relax(points, min = 30, f = 1, t = 1) {
  times(t, () => {
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

function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
