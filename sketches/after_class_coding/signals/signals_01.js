// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let zoom = 1024 / 16;

const editors = { A: {}, B: {}, C: {}, D: {} };

function setup() {
  pixelDensity(2);
  createCanvas(1024, 512).parent("canvas-wrap");

  for (key in editors) {
    const o = editors[key];
    o.editorEl = select(`#editor-${key}`);
    o.expressionEl = select(`#expression-${key}`);
    o.editorEl.input(draw);
    o.plotEl = select(`#plot-${key}`);
    o.errorEl = select(`.error`, o.editorEl);
  }

  noLoop();
}

function mouseWheel(event) {
  //zoom *= Math.pow(2, event.delta / 200);

  zoom *= event.delta > 0 ? 2 : 0.5;

  zoom = constrain(zoom, 1, 256);
  //   zoom += event.delta * 0.01;
  draw();
}

function draw() {
  background("white");

  push();
  translate(width * 0.5, height * 0.5);

  // this .01 shouldn't be needed, but the text wasn't
  // showing up when the zoom was exactly 64
  scale(zoom + 0.01);
  strokeWeight(1 / zoom);
  grid();
  scale(1, -1);

  for (key in editors) {
    const editor = editors[key];
    const error = plot(editor.expressionEl.value());
    editor.errorEl.html(error ? error.message : "");
  }

  pop();
}

function grid() {
  push();

  // grid lines
  if (zoom > 4) {
    noFill();
    stroke("#ccc");
    range(-100, 101).forEach((n) => {
      line(n, -100, n, 100);
      line(-100, n, 100, n);
    });
  }

  // axis
  noFill();
  stroke("#000");
  line(-1000, 0, 1000, 0);
  line(0, -1000, 0, 1000);

  if (zoom > 16) {
    const scale = 1 / zoom;
    // milestones
    noFill();
    stroke("black");
    line(1, -0.5, 1, 0.5);
    line(TWO_PI, -0.5, TWO_PI, 0.5);

    // label
    const labelY = 96;
    textSize(20 * scale);
    textAlign(CENTER, CENTER);
    textFont("Arial");
    fill("black");
    stroke("white");

    strokeWeight(6 * scale);
    text("1", 1, (labelY + 2) * scale);
    text("2π", TWO_PI, (labelY + 2) * scale);
  }
  pop();
}

function plot(e = "x") {
  let f;
  try {
    f = Function(`x`, `return (${e})`);
  } catch (e) {
    e.severity = "warn";
    e.message = "invalid expression";
    return e;
  }

  let error = false;

  push();
  noFill();
  strokeWeight(2 / zoom);
  beginShape();

  try {
    range(-512 / zoom, 512.1 / zoom, 1 / zoom).forEach((x) => {
      vertex(x, f(x));
    });
  } catch (e) {
    e.severity = "error";
    error = e;
  }

  endShape();
  pop();

  return error;
}

// crate an array of numbers from [min to max) by step
function range(min, max, step = 1) {
  const arr = [];
  for (let i = min; i < max; i += step) {
    arr.push(i);
  }
  return arr;
}

// round value to nearest x
function roundTo(value, x) {
  return Math.round(value / x) * x;
}
