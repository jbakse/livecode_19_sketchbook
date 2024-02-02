// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require /sketches/_libraries/webm-writer-0.3.0.js
// require /sketches/_util/grabber_01.js

/* global Grabber */
/* exported setup draw */

const grabber = new Grabber();

function setup() {
  pixelDensity(1);
  createCanvas(512, 512);
  noStroke();
  background(0);
  grabber.grabFrames(60);
}

function draw() {
  clear();
  fill(random(255));
  ellipse(random(512), random(512), 100, 100);
}
