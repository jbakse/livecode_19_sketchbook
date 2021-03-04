// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const pane = new Tweakpane();

const params = {};

window.setup = function () {
  createCanvas(600, 600);
  params.x = width * 0.5;
  pane.addInput(params, "x", { min: 0, max: width });
  params.y = width * 0.5;
  pane.addInput(params, "y", { min: 0, max: height });
};

window.draw = function () {
  background(200);
  ellipse(params.x, params.y, 100, 100);
  params.x += random(-4, 4);
  params.y += random(-4, 4);
  pane.refresh();
};
