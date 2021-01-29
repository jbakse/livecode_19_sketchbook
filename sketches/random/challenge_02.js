// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js

console.log("hello, grass");

function setup() {
  console.log("setup, grass");
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noLoop();
}

function draw() {
  console.log("draw, grass");
  background(40, 40, 80);

  fill(220, 220, 220);
  rect(0, height * 0.5, width, height * 0.5);

  drawGrass(0, height * 0.5 - 200, width, 200);
  //stroke(240, 240, 240);
  //drawGrass(0, height * 0.5 - 100, width, 100);
  //drawGrass(0, height * 0.5 - 100, width, 100);
}

function drawGrass(left, top, width, height) {
  // loop from the left to the right, one pixel per step
  for (let x = left; x < left + width; x++) {
    // x and y are the base of the blade of grass
    var y = top + height;

    // height of the grass
    // pick lowest of three "rolls" to bias strongly towards short blades
    // with occasional long ones
    // var bladeHeight = max(
    //   random(0, height),
    //   random(0, height),
    //   random(0, height),
    //   random(0, height),
    //   random(0, height)
    // );
    var bladeHeight = random(0, height);

    // horizontal offset of top of blade relative to base
    // average two "rolls" to bias towards middle
    var bladeLean = (random(-1, 1) + random(-1, 1)) * 0.5;

    // scale lean by height so that shorter blades aren't more leany
    bladeLean = bladeLean * bladeHeight;

    // scaling factor to to taste
    bladeLean = bladeLean * 0.2;

    // draw the grass

    //let greenShade = map(bladeHeight, 0, height, 0, 255);

    let shortColor = color(255, 200, 200);
    let tallColor = color(0, 255, 0);
    let blendColor = lerpColor(shortColor, tallColor, bladeHeight / height);

    stroke(blendColor);
    line(x, y, x + bladeLean, y - bladeHeight);
  }
}
