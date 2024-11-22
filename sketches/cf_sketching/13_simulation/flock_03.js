// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const birds = [];

function setup() {
  createCanvas(720, 480);

  for (let i = 0; i < 200; i++) {
    const bird = new Bird();
    bird.location.x = random(-500, 500);
    bird.location.y = random(-500, 500);
    bird.angle = random([-PI / 2, PI / 2]);
    bird.speed = random(1, 1.1);
    birds.push(bird);
  }
}

function draw() {
  for (const bird of birds) {
    bird.step();
  }
  background(0);
  translate(width / 2, height / 2);

  for (const bird of birds) {
    bird.draw();
  }

  ellipse(0, 0, 20, 20);
  ellipse(mouseX - width / 2, mouseY - height / 2, 20, 20);
}

function mousePressed() {
  // toggle draw loop
  isLooping() ? noLoop() : loop();
}

class Bird {
  constructor() {
    this.location = { x: 0, y: 0 };
    this.angle = 0;
    this.speed = 1;
  }

  step() {
    /// tend toward center
    const center = { x: 0, y: 0 };
    const aToCenter = angleBetweenPoints(this.location, center);
    const tToCenter = angleBetween(this.angle, aToCenter);
    this.angle = modAngle(this.angle + tToCenter * 0.005);

    // boids rules
    // https://en.wikipedia.org/wiki/Boids?useskin=vector

    /// separation: steer to avoid crowding local flockmates
    for (const bird of birds) {
      if (bird === this) continue;
      const d = dist(
        this.location.x,
        this.location.y,
        bird.location.x,
        bird.location.y
      );
      if (d < 20) {
        const aToBird = angleBetweenPoints(this.location, bird.location);
        const t = angleBetween(this.angle, aToBird);
        this.angle = modAngle(this.angle - t * 0.05);
      }
    }

    /// alignment: steer towards the average heading of local flockmates
    // get headings of nearby birds
    const headings = [];
    for (const bird of birds) {
      if (bird === this) continue;
      const d = dist(
        this.location.x,
        this.location.y,
        bird.location.x,
        bird.location.y
      );
      if (d < 100) {
        headings.push(bird.angle);
      }
    }
    // get average heading
    const avgHeading = averageAngle(headings);
    // adjust heading
    const tToHeading = angleBetween(this.angle, avgHeading);
    this.angle = modAngle(this.angle + tToHeading * 0.1);

    /// cohesion: steer to move towards the average position (center of mass) of local flockmates
    // get center of nearby birds
    const locations = [];
    for (const bird of birds) {
      if (bird === this) continue;
      const d = dist(
        this.location.x,
        this.location.y,
        bird.location.x,
        bird.location.y
      );
      if (d < 80) {
        locations.push(bird.location);
      }
    }
    // get average location
    const avgLocation = averagePoint(locations);
    // adjust heading
    const aToAvg = angleBetweenPoints(this.location, avgLocation);
    const tToAvg = angleBetween(this.angle, aToAvg);
    this.angle = modAngle(this.angle + tToAvg * 0.005);

    /// avoid mouse
    const mouse = { x: mouseX - width / 2, y: mouseY - height / 2 };
    const d = dist(this.location.x, this.location.y, mouse.x, mouse.y);
    if (d < 50) {
      const aToMouse = angleBetweenPoints(this.location, mouse);
      const t = angleBetween(this.angle, aToMouse);
      this.angle = modAngle(this.angle - t * 0.1);
    }

    /// avoid center
    const dToCenter = dist(this.location.x, this.location.y, 0, 0);
    if (dToCenter < 50) {
      const aToCenter = angleBetweenPoints(this.location, center);
      const t = angleBetween(this.angle, aToCenter);
      this.angle = modAngle(this.angle - t * 0.1);
    }

    this.location.x += cos(this.angle) * this.speed;
    this.location.y += sin(this.angle) * this.speed;
  }

  draw() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.angle);
    fill("white");
    noStroke();

    beginShape();
    vertex(9, 0);
    vertex(0, 2);
    vertex(0, -2);
    endShape(CLOSE);
    pop();
  }
}

// returns the angle you need to rotate a by to get an equivalent angle to B
// goes clockwise or counterclockwise depending on which way is shorter
// returns a number between -PI and PI
function angleBetween(a, b) {
  return modAngle(b - a);
}

// return random angle -PI to PI
function randomAngle() {
  return modAngle(random(TWO_PI));
}

// return equivalent angle between -PI and PI
function modAngle(a) {
  return mod(a + PI, TWO_PI) - PI;
}

function angleBetweenPoints(p1, p2) {
  const a = modAngle(atan2(p2.y - p1.y, p2.x - p1.x));
  return isNaN(a) ? 0 : a;
}

// Computes the average of an array of angles between -PI and PI
function averageAngle(angles) {
  let x = 0;
  let y = 0;

  // Convert each angle to a vector and sum the components
  for (const angle of angles) {
    x += Math.cos(angle);
    y += Math.sin(angle);
  }

  // Compute the average angle using atan2
  return Math.atan2(y, x); // Returns the angle in the range [-PI, PI]
}

// Computes the average of an array of points
function averagePoint(points) {
  let x = 0;
  let y = 0;

  // Sum the x and y components
  for (const point of points) {
    x += point.x;
    y += point.y;
  }

  // Compute the average
  return { x: x / points.length, y: y / points.length };
}

// returns the bounds of an array of points
function pointsBounds(points) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = min(minX, point.x);
    maxX = max(maxX, point.x);
    minY = min(minY, point.y);
    maxY = max(maxY, point.y);
  }

  return { minX, minY, maxX, maxY };
}

// a mod function that does not return negative numbers
// -2 % 5 = -2 // javascript % operator returns negative numbers
// mod(-2, 5) = 3 // we want 3
function mod(n, m) {
  return ((n % m) + m) % m;
}
