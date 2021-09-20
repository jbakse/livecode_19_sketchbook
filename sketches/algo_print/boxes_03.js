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
  const heights = perfectHeights(height, 5);
  //const sum = heights.reduce((a, b) => a + b);
  //console.log(sum);

  background(0, 0.0, 0.5);
  drawBlocks(heights);
}

// not actualy perfect, but kind of nice
// creates an array of `n` block heights that add up to `total_height`
// factor can be used to tune the proportional falloff
function perfectHeights(total_height, n, factor = 0.5) {
  const heights = [];

  // 1/2 + 1/4 + 1/8 + ... never reaches 1, see zeno's arrow
  // so we add a specifically calculated extra on to the target height
  const shortfall = pow(1 - factor, n);
  let remaining_height = total_height / (1 - shortfall);

  for (let i = 0; i < n; i++) {
    const block_height = remaining_height * factor;
    heights.push(block_height);
    remaining_height -= block_height;
  }
  return heights;
}

function drawBlocks(heights) {
  noStroke();
  let x = 0;
  for (let i = 0; i < heights.length; i++) {
    fill(fract(i * 0.4), 1, 1);
    rect(0, x, width, heights[i]);
    x += heights[i];
  }
}
