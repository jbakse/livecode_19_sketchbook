// require /sketches/_libraries/webm-writer-0.3.0.js
// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// require /sketches/_util/grabber_02.js

/* exported setup draw*/

function setup() {
  pixelDensity(1);
  createCanvas(960, 540);
}

function draw() {
  background("black");

  noFill();
  stroke(255, 100);

  translate(width * 0.5, height * 0.5);

  id = 0;
  burst(6, 200, frameCount * 0.001);
}

let id = 0;

function burst(rays = 5, length = 100, r = 0) {
  if (length < 5) return;
  id++;

  rotate(r + noise(id));
  for (let i = 0; i < rays; i++) {
    let a = map(i, 0, rays, 0, 2 * PI);
    let x = sin(a) * length;
    let y = cos(a) * length;
    line(0, 0, x, y);
    push();
    translate(x, y);
    burst(rays, length * 0.5, r);
    pop();
  }
}
