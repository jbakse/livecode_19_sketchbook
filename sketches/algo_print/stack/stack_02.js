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
  // set the first rect height
  const base_top = 300;
  const base_bottom = constrain(mouseY, 500, 800);

  const tops = calcHeights(base_bottom, base_bottom - base_top, 4).reverse();
  const bottoms = calcHeights(height - base_top, base_bottom - base_top, 4);

  const heights = tops.concat([base_bottom - base_top], bottoms).map(floor);

  // draw
  background(0, 0.5, 0.5);
  noStroke();
  let x = 0;
  for (let i = 0; i < heights.length; i++) {
    fill((1 / heights.length) * i, 1, 1);
    rect(0, x, width, heights[i]);
    x += heights[i];
  }
}

function calcHeights(total_height, base_height, blocks) {
  // rough in the blocks
  const heights = Array(blocks).fill(0);
  let remaining_height = total_height - base_height;
  let ratio = base_height / total_height;
  for (let i = 0; i < blocks; i++) {
    heights[i] = remaining_height * ratio;
    remaining_height -= heights[i];
  }

  // fill in the gap
  for (let i = 0; i < blocks; i++) {
    heights[i] += remaining_height / (blocks - 1);
  }

  return heights;
}
