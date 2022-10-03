// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

const circles = [];

function setup() {
  createCanvas(512, 512);
  circles.push({
    x: width * 0.5,
    y: height * 0.5,
    r: 50,
  });
  //   noLoop();
}

function draw() {
  // add a circle

  //   const last = circles[circles.length - 1];
  while (!addCircle());

  background("black");
  noFill();
  stroke("green");
  circles.forEach((c) => ellipse(c.x, c.y, c.r * 2, c.r * 2));

  //   if (frameCount === 100) noLoop();
}

function addCircle() {
  const last = random(circles);
  const a = random(2 * PI);
  const r = last.r + random(10, 20);
  const newCircle = {
    x: last.x + cos(a) * r,
    y: last.y + sin(a) * r,
    r: 0,
  };

  // slightly tend the circles toward center
  newCircle.x = lerp(newCircle.x, width * 0.5, 0.05);
  newCircle.y = lerp(newCircle.y, width * 0.5, 0.05);

  const nearest = circles.reduce((previous, current) => {
    const d = dist(newCircle.x, newCircle.y, current.x, current.y) - current.r;
    if (!previous || d < previous.distance) {
      return {
        target: current,
        distance: d,
      };
    }
    return previous;
  }, false);

  newCircle.r = nearest.distance; // - nearest.target.r;

  if (nearest.distance > 0) {
    circles.push(newCircle);
    return true;
  }
  return false;
}
