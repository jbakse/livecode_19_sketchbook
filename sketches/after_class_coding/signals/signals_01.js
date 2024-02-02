// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let zoom = 1024 / 16;
let drawZoom = zoom;

const editors = [
  {
    id: "Z",
    color: "#AAA",
    storage: "shared",
  },
  {
    id: "A",
    color: "#07D",
    storage: "shared",
  },
  {
    id: "B",
    color: "#7D7",
    storage: "my",
  },
  {
    id: "C",
    color: "#D0D",
  },
  {
    id: "D",
    color: "#D70",
  },
];

let shared;
// shared.mode, "presenting" | "synced" | "unsynced"
// shared.presenter, id | undefined

id = Math.random();

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "signals", "main");
  shared = partyLoadShared("shared");
}

function setup() {
  pixelDensity(2);
  partyToggleInfo(false);
  const cavnas = createCanvas(1024, 512).parent("canvas-wrap");

  if (partyIsHost()) {
    shared.mode = "unsynced";
  }

  for (editor of editors) {
    editor.editorEl = select(`#editor-${editor.id}`);
    editor.expressionEl = select(`#expression-${editor.id}`);
    editor.expressionEl.input(onExpressionInput.bind(editor));
    editor.plotEl = select(`#plot-${editor.id}`);
    editor.plotEl.input(draw);
    editor.errorEl = select(".error", editor.editorEl);

    if (shared[editor.id]) editor.expressionEl.value(shared[editor.id]);
    partyWatchShared(shared, editor.id, onExpressionChanged.bind(editor));
  }

  partyWatchShared(shared, "mode", onModeChanged);
  onModeChanged();
  // partyWatchShared(shared, draw);

  canvas.addEventListener("wheel", onMouseWheel, {
    passive: false,
  });

  // noLoop();
}

function onModeChanged() {
  const inputsDisabled =
    shared.mode === "presenting" && shared.presenter !== id;

  for (editor of editors) {
    editor.expressionEl.elt.disabled = inputsDisabled;
    // editor.plotEl.elt.disabled = inputsDisabled;
  }

  if (shared.mode === "presenting" && shared.presenter === id) {
    select("#status").html("presenting");
  }
  if (shared.mode === "presenting" && shared.presenter !== id) {
    select("#status").html("watching");
  }
  if (shared.mode === "synced") {
    select("#status").html("synced");
  }
  if (shared.mode === "unsynced") {
    select("#status").html("");
  }

  draw();
}
function onExpressionChanged(newValue) {
  console.log("expression changed", newValue);
  this.expressionEl.value(newValue);
  draw();
}

function onExpressionInput() {
  console.log("onExpressionInput");
  if (shared.mode === "presenting" || shared.mode === "synced") {
    shared[this.id] = this.expressionEl.value();
  }
  draw();
}

function onMouseWheel(event) {
  changeZoom(event.deltaY);
  event.preventDefault();
}

function keyPressed(e) {
  const modifier = e.ctrlKey || e.metaKey;
  if (!modifier) return;

  // presenter hotkey "p"
  if (key === "p") {
    if (shared.mode === "presenting") {
      shared.presenter = undefined;
      shared.mode = "synced";
    } else if (shared.mode === "synced") {
      shared.presenter = undefined;
      shared.mode = "unsynced";
    } else if (shared.mode === "unsynced") {
      shared.presenter = id;
      shared.mode = "presenting";
    }
    e.preventDefault();
    return false;
  }

  // show secrets "s"
  if (key === "s") {
    select("#editors").toggleClass("reveal-all");
    e.preventDefault();
    return false;
  }

  // zoom in "+"
  if (modifier && key === "=") {
    changeZoom(1);
    e.preventDefault();
    return false;
  }

  // zoom out "-"
  if (modifier && key === "-") {
    changeZoom(-1);
    e.preventDefault();
    return false;
  }
}

function changeZoom(v) {
  zoom *= v > 0 ? 2 : 0.5;
  zoom = constrain(zoom, 1, 256);
  draw();
}

function draw() {
  // console.log("draw");

  const inputSelectEl = select("#input-select");
  const input = inputSelectEl.value();
  let inputValue;
  if (input === "frameCount") inputValue = frameCount;
  if (input === "frameCount60") inputValue = frameCount / 60;
  if (input === "millis") inputValue = millis();
  if (input === "millis1000") inputValue = millis() / 1000;
  if (input === "mouseX") inputValue = mouseX;
  if (input === "mouseXZoom") inputValue = (mouseX - 512) / zoom;

  // smooth zoom changes
  // drawZoom = lerp(drawZoom, zoom, 0.25);
  // if (abs(zoom - drawZoom) < 1) drawZoom = zoom;

  drawZoom = zoom;

  background("white");

  drawGraph(inputValue);
  drawAllVis(inputValue);
}

function drawGraph(inputValue = 0) {
  push();

  // configure zoomed drawing
  // the + 0.01 shouldn't be needed, but the text wasn't
  // showing up when the zoom was exactly 64
  translate(width * 0.5, height * 0.5);
  scale(drawZoom + 0.01);

  // draw grid
  strokeWeight(1 / drawZoom);
  drawGrid(inputValue);

  // plot them
  scale(1, -1);

  for (editor of editors) {
    if (editor.plotEl.checked()) {
      stroke(editor.color);
      strokeWeight(3 / drawZoom);
      const error = plot(editor.expressionEl.value());
      editor.errorEl.html(error ? error.message : "");
    }
  }

  pop();
}

function drawAllVis(inputValue = 0) {
  const inputSelectEl = select("#input-select");
  const input = inputSelectEl.value();
  const outputSelectEl = select("#output-select");
  const output = outputSelectEl.value();
  if (input === "none" || output === "none") return;

  console.log(input, output);
  push();

  stroke("black");
  strokeWeight(10);

  function drawOneVis(id, x) {
    const editor = editors.find((e) => e.id === id);
    if (editor.plotEl.checked()) {
      const out = yForX(editor.expressionEl.value(), inputValue);
      if (typeof out !== "number") return;
      const c1 = color("black");
      const c2 = color(editor.color);
      const c = output === "color" ? lerpColor(c1, c2, out) : c2;
      const y = output === "y" ? map(out, 0, 1, 256, 0) : 100;
      const w = output === "width" ? map(out, 0, 1, 0, 100) : 100;

      fill(c);
      ellipse(x, y, w, 100);
    }
  }

  drawOneVis("Z", 100);
  drawOneVis("A", 250);
  drawOneVis("B", 400);

  pop();
}

function drawGrid(playbackHead = 0) {
  push();

  // grid lines
  if (drawZoom > 4) {
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
  line(playbackHead, -1000, playbackHead, 1000);

  if (drawZoom > 16) {
    const scale = 1 / drawZoom;
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

function yForX(e = "x", x) {
  try {
    f = Function("x", `return (${e})`);
    return f(x);
  } catch (e) {
    return undefined;
  }
}

function plot(e = "x") {
  // "compile" the expression
  let f;
  try {
    f = Function("x", `return (${e})`);
  } catch (e) {
    e.severity = "warn";
    e.message = "invalid expression";
    return e;
  }

  let error = false;

  // plot the expression
  push();
  noFill();
  beginShape();

  try {
    range(-512 / drawZoom, 512.1 / drawZoom, 1 / drawZoom).forEach((x) => {
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
