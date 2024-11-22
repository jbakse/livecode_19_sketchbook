// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/**
# 2D Vectors
lets start with a 2D vector 
a vector represents a value with a direction and magnitude
we could represent it like {angle: 45, magnitude: 10}
we could represent it like {x: 7, y: 7}
we'll use the {x, y} representation

# Postion
we can use a vector to represent a position
we need to assume a unit
in p5.js a position 10 pixels over and 5 down could be {x: 10, y: 5}

# Velocity
Velocity is change in position over time.
we can't quite represent a velocity with just {x, y}
because speed is change over -time-
but if we assume that time is always the same, a unit time of 1
then a vector can represent a velocity
if we want to represent a moving straight left quickly: {x: -10, y: 0}

# Acceleration
Acceleration is change in velocity over time
On earth graphity is "down" @ 9.8 m/s^2
In our sketch, we might represent gravity as {x: 0, y: 1}
down at 1 pixel per step

# p5.Vector
https://p5js.org/reference/p5/p5.Vector/

p5 has a 3D vector class built in with x, y, and z components
p5 Vector objects also have handy methods like add, mult, mag, dot, cross, etc

its a handy tool, but this code uses simple {x, y} vectors for transparency

*/

const ball = {
  position: { x: 180, y: 240 },
  velocity: { x: 10, y: -10 },
};

function setup() {
  createCanvas(720, 480);
  background("black");

  drawArc();
}

function draw() {
  step(0.1); // try .1, 1, 5, 10

  fill("white");
  noStroke();
  ellipse(ball.position.x, ball.position.y, 4, 4);
}

function drawArc() {
  noFill();
  stroke("gray");
  strokeWeight(1);
  beginShape();
  for (let t = 0; t < 100; t++) {
    const pT = positionAtTime(ball.position, ball.velocity, t);
    vertex(pT.x, pT.y);
  }
  endShape();
}

function positionAtTime(startPosition, startVelocity, t) {
  const gravity = { x: 0, y: 1 }; // Gravity acceleration (adjust as needed, e.g., { x: 0, y: 9.8 } for Earth's gravity)

  return {
    x: startPosition.x + startVelocity.x * t + 0.5 * gravity.x * t * t,
    y: startPosition.y + startVelocity.y * t + 0.5 * gravity.y * t * t,
  };
}

function step(t = 1) {
  // we're gonna numerically integrate here
  // acceleration is the derivative (change in) of velocity; velocity is the integral (accumulation) of acceleration
  // velocity is the derivative (change in) of position; position is the integral (accumulation) of velocity
  // itegrating velocity gives us position
  // so we're gonna integrate (apply) acceleration to velocity to get the new velocity
  // and itegrate (apply) velocity to position to get the new position
  // we're gonna do that that numrically instead of analytically
  // Numerically: Approximate the solution using specific numbers and computational methods.
  // Analytically: Solve for a general, exact, closed-form expression.

  // apply gravity to velocity
  const gravity = { x: 0, y: 1 }; // gravity is an acceleration "down"
  ball.velocity.x += gravity.x * t;
  ball.velocity.y += gravity.y * t;

  // apply velocity to position
  ball.position.x += ball.velocity.x * t;
  ball.position.y += ball.velocity.y * t;
}
