console.log("hello, world!");

// set up the p5 canvas

function setup() {
  createCanvas(400, 400);
}

// draw the p5 canvas

function draw() {
  background(220);
  // draw 10 randomly colered circles
  for (let i = 0; i < 10; i++) {
    fill(random(255), random(255), random(255));
    circle(random(width), random(height), random(50));
  }
}
