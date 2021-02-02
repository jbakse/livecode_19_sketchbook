// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  noStroke();
}

function draw() {
  background(50, 50, 50);

  var rows = height / 50;
  var cols = width / 50;

  for (col = 0; col < rows; col++) {
    fill(random(255), random(255), random(255));
    for (row = 0; row < rows; row++) {
      drawThing(col * 50 + 25, row * 50 + 25);
    }
  }
}

var brownianRadius = 25;

function drawThing(x, y) {
  var radius;

  // even
  radius = random(0, 50);

  ellipse(x, y, radius, radius);
}
