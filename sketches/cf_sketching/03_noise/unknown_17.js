// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// lets see if i can use a generator to show my work
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

// i used smoothstep in here to actually litterally smooth the steppes!
// set up the draw function as a generator so you can watch it work!

const SCALE = 1;

const g = gen();
window.setup = function () {
  createCanvas(750 * SCALE, 1000 * SCALE);
  frameRate(60);
  colorMode(RGB, 1);

  noFill();
  stroke(0);

  noiseDetail(3);
  noiseSeed(1);

  background(1);
  push();
  scale(SCALE);
  drawSky();
  pop();
};

function draw() {
  g.next();
}

function* gen() {
  const amplitude = 200;

  const xRes = 1;
  const yRes = 2;
  const rough_a = 5;
  const rough_f = 0.1;
  let t = performance.now();
  let row = 0;

  for (let y = 0; y < 1000; y += yRes) {
    row++;
    let last_tree_x = -100;
    for (let x = 0; x <= 750; x += xRes) {
      push();
      scale(SCALE);

      // segment x
      const x1 = x - xRes;
      const x2 = x;

      // "perspective"
      const p = map(y, 0, 1000, 0.3, 1);
      const tx1 = (x1 - 375) / p + 375;
      const tx2 = (x2 - 375) / p + 375;
      const ty = y; // / lerp(p, 1, 0.7);

      // segment y
      const y1 = 150 + y + hill(tx1, ty).height * amplitude;
      const y2 = 150 + y + hill(tx2, ty).height * amplitude;

      // roughen

      let _x1 = x1 + noise(x1 * rough_f, y1 * rough_f, 0) * rough_a;
      let _y1 = y1 + noise(x1 * rough_f, y1 * rough_f, 1) * rough_a;
      let _x2 = x2 + noise(x2 * rough_f, y2 * rough_f, 0) * rough_a;
      let _y2 = y2 + noise(x2 * rough_f, y2 * rough_f, 1) * rough_a;

      const slope = (y2 - y1) / (x2 - x1);

      // draw mountain blocker
      fill(
        lerpColor(
          color(1, 0.75, 0.75),
          color(1, 1, 0.75),
          x / 750 + slope * 0.05
        )
      );
      noStroke();
      quad(_x1, _y1, _x2, _y2, _x2, _y2 + 100, _x1, _y1 + 100);

      // draw mountain edge

      // shading
      let even = row % 3;
      let alpha = constrain(even, 0, 1.5);
      if ((!even && slope < -1) || (even && slope > 0.5)) {
        let broken = noise(x * 0.2, y, 3) > 0.5 ? 1 : 0; // * 4 + slope * 0.2 + 1;
        alpha = broken;
      }

      // simple gaps
      if (noise(x * 0.03, y, 4) < 0.1) alpha = 0.0;

      noFill();
      stroke(0.2, 0.05, 0.1, alpha * 0.5);
      strokeWeight(1.5);
      line(_x1, _y1, _x2, _y2);

      if (abs(slope) < 0.1 && hill(tx1, ty).height > 0.5) {
        // cull random
        if (noise(x, y) < 0.2) {
          const spacing = floor(pow(p, 2) * 20 + 2);
          console.log(spacing);
          // cull rows
          if ((row + floor(x / 4)) % spacing === 0) {
            let boost_size = 1;
            if (noise(x, y) < 0.04) {
              boost_size = 2;
            }
            let s = 60 * pow(p, 2) * boost_size;

            if (x > last_tree_x + s) {
              last_tree_x = x;
              push();

              tree(x1, y1 - noise(tree_id) * 30 + 15, s);

              pop();
            }
          }
        }
      }
      pop();
    }

    if (performance.now() - t > 15) {
      //   console.log(i);
      yield 1;
      t = performance.now();
    }
  }
}

let tree_id = 0;
function tree(x = 0, y = 0, size1 = 30) {
  //stroke("black");
  translate(x, y);
  // tree fill
  noStroke();
  let fill_color = color(0.6, 0.7, 0.65);
  if (noise(x / 100, y / 100) < 0.25) {
    fill_color = color(0.5, 0.6, 0.55);
  }
  fill_color = lerpColor(
    fill_color,
    color(0.6, 0.6, 0.9),
    map(y, 100, 700, 0.5, 0)
  );
  fill(fill_color);

  treeShape(size1);

  // tree stroke
  stroke(0, noise(tree_id) * 0.5 + 0.25);
  strokeWeight(1);
  noFill();
  treeShape(size1, -0.25 * PI, 0.25 * PI);

  // tree detail
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
    const rough = (noise(tree_id, a + 10, 4) - 0.5) * r * 0.4;

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

function hill(x, y) {
  const hill_frequency = 0.003;
  const mix_frequency = 0.002;
  y *= 2;
  const hill1 = noise((x + 1100) * hill_frequency, y * hill_frequency, 1);
  // const hill1 = sin(dist(100, 200, x, y) * 0.01) * 0.2;
  const stepped1 = steppe(hill1, 3);
  // const hill2 = sin(dist(100, 200, x, y) * 0.01) * 0.2;
  const stepped2 = steppe(hill1, 6);
  const mix = noise(x * mix_frequency, y * mix_frequency, 2) * 2 - 0.2;
  const height = lerp(stepped1, stepped2, mix, true);
  const c = lerpColor(color("red"), color("green"), mix, true);
  return { height: height, color: c };
}

// takes linear n and bends it into `steppes` smooth steps per whole number.
function steppe(n, steppes) {
  const i = floor(n * steppes);
  const f = fract(n * steppes);
  const smooth_f = smoothstep(0.45, 0.55, f);
  const stepped = (i + smooth_f) / steppes;
  return stepped;
}

//https://en.wikipedia.org/wiki/Smoothstep
function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3 - 2 * x);
}

function drawSky() {
  let gap = 3;
  let y = -10;
  push();
  blendMode(DARKEST);
  for (let i = 0; i < 100; i++) {
    y += gap;
    gap *= 1.022;
    // strokeWeight(map(noise(i * 0.4), 0, 1, 0.1, 0.8));

    stroke(lerpColor(color(0.8, 1.0, 0.9), color(0.8, 0.9, 1.0), i / 50));
    strokeWeight(10);
    line(0, y, width, y);
    stroke(0);
    strokeWeight(0.5);
    sketchyLine(0, y, width, y, 1, 0.05, map(y, 0, 100, 0, 3));
  }
  pop();
}

function sketchyLine(
  x1,
  y1,
  x2,
  y2,
  stepSize = 5,
  noiseFrequency = 0.01,
  noiseAmplitude = 2
) {
  //const steps = dist(x1, y1, x2, y2) / stepSize;
  let lineLength = dist(x1, y1, x2, y2);
  beginShape();
  vertex(x1, y1);
  for (let n = min(stepSize, lineLength); n < lineLength; n += stepSize) {
    const x = map(n, 0, lineLength, x1, x2);
    const y = map(n, 0, lineLength, y1, y2);
    const nX =
      noise(x * noiseFrequency, y * noiseFrequency, 0) * noiseAmplitude;
    const nY =
      noise(x * noiseFrequency, y * noiseFrequency, 1) * noiseAmplitude;

    vertex(x + nX, y + nY);
  }

  vertex(x2, y2);
  endShape();
}
