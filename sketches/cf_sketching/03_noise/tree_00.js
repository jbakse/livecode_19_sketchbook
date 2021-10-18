// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

function setup() {
  createCanvas(500, 500);
  colorMode(RGB, 1);
  noLoop();
}

let tree_id = 0;
function tree(size1 = 30) {
  //stroke("black");

  // tree fill
  noStroke();
  fill(1);
  treeShape(size1);

  // tree stroke
  stroke(0, 0.8);
  strokeWeight(1);
  noFill();
  treeShape(size1, -0.5 * PI, 0.5 * PI);

  let a = 0;
  let r = size1 * 0.5;
  while (r < size1 * 0.9) {
    a += 0.01 * size1;
    r += 0.1;
    const rough = (noise(tree_id, a + 10, 4) - 0.5) * size1 * 0.5;
    let x1 = sin(a) * (r + rough);
    let y1 = -cos(a) * (r + rough);
    let x2 = sin(a) * (r - 2 + rough);
    let y2 = -cos(a) * (r - 2 + rough);
    x1 += noise(x1, y1, 1) * 3;
    y1 += noise(x1, y1, 2) * 3;
    x2 += noise(x1, y1, 3) * 3;
    y2 += noise(x1, y1, 4) * 3;
    if (noise(tree_id, x1 * 0.1, y1 * 0.1) < 0.3) {
      line(x1, y1, x2, y2);
    }
  }

  tree_id++;
}

function treeShape(r, start = -PI, end = PI) {
  const bump_f = r * 0.5;
  const bump_a = 2;
  beginShape();

  for (let a = start; a < end; a += 0.01) {
    // scribble shape
    const stretch = noise(tree_id, a, 1) * 5;
    const squash = noise(tree_id, a, 2);
    const spike = noise(tree_id, a, 3);
    const bump =
      pow(abs(sin(a * bump_f + stretch)), 3 * spike) * bump_a * squash;

    // circle rough
    const rough = (noise(tree_id, a + 10, 4) - 0.5) * r * 0.5;

    // plot circle + scribble
    // a: 0 is up, + is clockwise
    let x = sin(a) * (r + bump + rough);
    let y = -cos(a) * (r + bump + rough);

    // flatten bottom
    // if (y > 0) {
    //   let factor = map(abs(a), 0, 0.5 * PI, 0, 1, true);
    //   y = lerp(y, y * 0.5, factor);
    // }

    // x += noise(tree_id, a * 5, 1) * 3;
    // y += noise(tree_id, a * 5, 2) * 3;
    vertex(x, y);
  }

  endShape();
}

function draw() {
  background(0.8);
  for (let y = 100; y <= 400; y += 100) {
    for (let x = 100; x <= 400; x += 100) {
      push();
      translate(x, y);
      tree(map(y, 100, 400, 20, 50));
      pop();
    }
  }
}
