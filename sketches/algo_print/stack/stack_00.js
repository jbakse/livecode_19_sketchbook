// a tall container rectangle with a stack of rectangles in it.
// the top stacked rectangle can be resized
// the other stacked rectangles should resize so that
// 1) each stacked rectangle is taller or equal to than the one below it
// 2) the container rectangle is filled

// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(512, 1024);
  colorMode(HSB, 1);
}

function draw() {
  const stackCount = 5;
  const heights = Array(stackCount).fill(10);

  // set the first rect height
  heights[0] = constrain(mouseY, height / stackCount, height - 128);
  console.log(heights);

  // rough in the rest
  let remaining_height = height - heights[0];
  for (let i = 1; i < stackCount; i++) {
    heights[i] = remaining_height / 2;
    heights[i] = min(heights[i], heights[i - 1]);
    remaining_height -= heights[i];
  }

  // fill in the gap
  for (let i = 1; i < stackCount; i++) {
    // heights[i] += remaining_height / (stackCount - 1);
  }

  // draw
  background(0, 0.5, 0.5);
  noStroke();
  let x = 0;
  for (let i = 0; i < stackCount; i++) {
    fill((1 / stackCount) * i, 1, 1);
    rect(0, x, width, heights[i]);
    x += heights[i];
  }
}
