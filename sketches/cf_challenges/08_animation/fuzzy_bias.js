// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* global Tweakpane */
/* exported setup draw */

/**
 * This sketch was made to investigate an issue i saw where picking
 * random points in a circle was showing bais towards the x and y axis.
 *
 * Oddly, this issue just didn't appear here. Likely I had a typo/bug in
 * the problem code that was eliminated when i recoded it here. Or maybe
 * something weird was going on that was fixed by a restart between then
 * and now.
 */

const pane = new Tweakpane();
const params = {
  frame_rate: 0,
};

function setup() {
  createCanvas(512, 512);
  frameRate(60);
  pane.addMonitor(params, "frame_rate");
  pane.addMonitor(params, "frame_rate", {
    view: "graph",
    min: 0,
    max: 60,
  });
}

function draw() {
  background("gray");

  stroke("white");
  noFill();
  line(64, 256, 448, 256);

  noStroke();
  fill("black");

  const a = map(frameCount, 0, 60, 0, PI);
  let jump = sin(a) * 100;
  const y = 256 - jump;

  fill(0, 0, 0, 5);
  fuzzy_ellipse(256, y, 50, 50, 150);

  params.frame_rate = frameRate();
}

function fuzzy_ellipse(x, y, w, h, fuzz = 100) {
  for (let i = 0; i < 100; i++) {
    const xx = random(-fuzz, fuzz);
    const yy = random(-fuzz, fuzz);
    if (dist(0, 0, xx, yy) > fuzz) continue;
    ellipse(x + xx, y + yy, w, h);
  }
}

function fuzzy_ellipse_2(x, y, w, h, fuzz = 100) {
  for (let i = 0; i < 100; i++) {
    const a = random(2 * PI);
    const d = sqrt(random()) * fuzz;
    ellipse(
      //
      x + sin(a) * d,
      y + cos(a) * d,
      w,
      h
    );
  }
}
