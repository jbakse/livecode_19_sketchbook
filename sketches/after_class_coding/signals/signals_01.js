// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

// user selected zoom level, 1 to 256 power of 2
let zoom = 1024 / 16;
// currently shown zoom level, lerps between zoom levels
let drawZoom = zoom;

// p5.party "shared object"
let shared;
// id for this client
let partyId = Math.random();

// element of the CodeMirror editor
let codeEditor;

// drag state
let isDragging = false;
let dragStartX;
let scrollOffset = 0;

// settings for the experession editors
// these objects will also store refrences to the DOM elements
const editors = [
  { id: "Z", color: "#AAA", defaultValue: "noise(x)", defaultChecked: true },
  { id: "A", color: "#07D", defaultValue: "x", defaultChecked: true },
  { id: "B", color: "#7D7", defaultValue: "cos(x)", defaultChecked: false },
  { id: "C", color: "#D0D", defaultValue: "fract(x)", defaultChecked: false },
  { id: "D", color: "#D70", defaultValue: "-fract(x)", defaultChecked: false },
];

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "signals", "main");
  shared = partyLoadShared("shared", { mode: "unsynced", presenter: partyId });
}

function setup() {
  createCanvas(1024, 512).parent("canvas-wrap");

  editors.forEach(createEditor);

  // const codeEl = select("#code");
  // codeEl.input(redraw);

  loadInputs();

  partyWatchShared(shared, "mode", onModeChanged);
  onModeChanged();

  canvas.addEventListener("wheel", onMouseWheel, {
    passive: false,
  });

  canvas.addEventListener("mousedown", startDragging);
  canvas.addEventListener("mousemove", drag);
  window.addEventListener("mouseup", stopDragging);
  // canvas.addEventListener("mouseleave", stopDragging);

  window.addEventListener("keydown", onKeyPressed);
  window.focus();

  select("#animate-checkbox").changed(toggleAnimation);
}

function startDragging(event) {
  isDragging = true;
  dragStartX = event.clientX - scrollOffset;
}

function drag(event) {
  if (!isDragging) return;
  const x = event.clientX - dragStartX;
  scrollOffset = x;
  redraw();
}

function stopDragging() {
  isDragging = false;
}

function toggleAnimation() {
  select("#animate-checkbox").checked() ? loop() : noLoop();
}

function createEditor(editor) {
  const editorHTML = `
    <div class="expression-editor" id="editor-${editor.id}">
      <label for="expression-${editor.id}">${editor.id} =</label>
      <div class="validated-field">
        <input 
          type="text"
          id="expression-${editor.id}"
          spellcheck="false"
          value="${editor.defaultValue}"
        >
        <div class="error"></div>
      </div>
      <input 
        type="checkbox" 
        id="plot-${editor.id}" 
        class="toggle-input" 
        ${editor.defaultChecked ? "checked" : ""}
      >
      <label for="plot-${editor.id}" class="toggle">P</label>
    </div>
  `;

  select("#editors").elt.insertAdjacentHTML("beforeend", editorHTML);

  const editorEl = select(`#editor-${editor.id}`);
  editor.expressionEl = select(`#expression-${editor.id}`, editorEl);
  editor.plotEl = select(`#plot-${editor.id}`, editorEl);
  editor.errorEl = select(".error", editorEl);

  // listen for changes to expression
  editor.expressionEl.input(onExpressionInput.bind(editor));

  // listen for changes to plot checkbox
  editor.plotEl.input(redraw);

  // load intial value from shared
  if (shared[editor.id]) editor.expressionEl.value(shared[editor.id]);

  // watch for changes to shared value
  partyWatchShared(shared, editor.id, onExpressionChanged.bind(editor));
}

function onModeChanged() {
  const inputsDisabled = shared.mode === "presenting" &&
    shared.presenter !== partyId;

  for (editor of editors) {
    editor.expressionEl.elt.disabled = inputsDisabled;
    // editor.plotEl.elt.disabled = inputsDisabled;
  }

  if (shared.mode === "presenting" && shared.presenter === partyId) {
    select("#status").html("presenting");
  }
  if (shared.mode === "presenting" && shared.presenter !== partyId) {
    select("#status").html("watching");
  }
  if (shared.mode === "synced") {
    select("#status").html("synced");
  }
  if (shared.mode === "unsynced") {
    select("#status").html("");
  }

  redraw();
}
function onExpressionChanged(newValue) {
  console.log("expression changed", newValue);
  this.expressionEl.value(newValue);
  redraw();
}

function onExpressionInput() {
  console.log("onExpressionInput");
  if (shared.mode === "presenting" || shared.mode === "synced") {
    shared[this.id] = this.expressionEl.value();
  }
  redraw();
}

function onMouseWheel(event) {
  changeZoom(event.deltaY);
  event.preventDefault();
}

function onKeyPressed(e) {
  const isModifierPressed = e.ctrlKey || e.metaKey;
  const key = e.key || e.code;
  console.log("key pressed", key, isModifierPressed);

  /// format code with Prettier
  if (isModifierPressed && key.toLowerCase() === "s") {
    formatCode();
    e.preventDefault();
    return false;
  }

  /// zoom in
  if (isModifierPressed && key === "=") {
    changeZoom(1);
    e.preventDefault();
    return false;
  }

  /// zoom out
  if (isModifierPressed && key === "-") {
    changeZoom(-1);
    e.preventDefault();
    return false;
  }

  // if (!modifier) return;

  // // presenter hotkey "p"
  // if (key === "p") {
  //   if (shared.mode === "presenting") {
  //     shared.presenter = undefined;
  //     shared.mode = "synced";
  //   } else if (shared.mode === "synced") {
  //     shared.presenter = undefined;
  //     shared.mode = "unsynced";
  //   } else if (shared.mode === "unsynced") {
  //     shared.presenter = id;
  //     shared.mode = "presenting";
  //   }
  //   e.preventDefault();
  //   return false;
  // }
}

function formatCode() {
  const currentCode = codeEditor.getValue();
  try {
    const formattedCode = prettier.format(currentCode, {
      parser: "babel",
      plugins: prettierPlugins,
    });
    codeEditor.setValue(formattedCode);
    console.log("Code formatted successfully");
  } catch (error) {
    console.error("Error formatting code:", error);
  }
}

function changeZoom(v) {
  zoom *= v > 0 ? 2 : 0.5;
  zoom = constrain(zoom, 1, 256);
  redraw();
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
  drawZoom = lerp(drawZoom, zoom, 0.25);
  if (abs(zoom - drawZoom) < 1) drawZoom = zoom;

  // drawZoom = zoom;

  background("white");

  push();
  translate(scrollOffset, 0);
  drawGraph(inputValue);
  drawAllVis(inputValue);
  runCode();
  pop();

  storeInputs();
}

function storeInputs() {
  localStorage.setItem("expressionZ", editors[0].expressionEl.value());
  localStorage.setItem("expressionA", editors[1].expressionEl.value());
  localStorage.setItem("expressionB", editors[2].expressionEl.value());
  localStorage.setItem("expressionC", editors[3].expressionEl.value());
  localStorage.setItem("expressionD", editors[4].expressionEl.value());
  localStorage.setItem("code", codeEditor.getValue());
  // console.log("store code", codeEditor.getValue());
}

function loadInputs() {
  editors[0].expressionEl.value(localStorage.getItem("expressionZ"));
  editors[1].expressionEl.value(localStorage.getItem("expressionA"));
  editors[2].expressionEl.value(localStorage.getItem("expressionB"));
  editors[3].expressionEl.value(localStorage.getItem("expressionC"));
  editors[4].expressionEl.value(localStorage.getItem("expressionD"));

  const savedCode = localStorage.getItem("code") ?? "";
  // console.log("load code", savedCode);
  codeEditor = CodeMirror(document.getElementById("code"), {
    value: savedCode,
    mode: "javascript",
    lineNumbers: true,
    theme: "default",
    tabSize: 2,
    lint: {
      esversion: 11,
      browser: true,
      devel: true,

      unused: true,
    },
    gutters: ["CodeMirror-lint-markers"],
  });

  // console.log("initial value", codeEditor.getValue());

  codeEditor.on("change", () => {
    localStorage.setItem("code", codeEditor.getValue());
    console.log("code changed", codeEditor.getValue());
    redraw();
  });
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
  drawOneVis("C", 550);
  drawOneVis("D", 700);

  pop();
}

function drawGrid(playbackHead = 0) {
  /// find visbible bounds
  const left = (-512 - scrollOffset) / drawZoom;
  const right = (512 - scrollOffset) / drawZoom;
  const top = (-256) / drawZoom;
  const bottom = (256) / drawZoom;

  push();
  /// draw grid
  let c = color(210, lerp(0, 100, drawZoom / 8));

  stroke(c);
  noFill();

  range(floor(left), floor(right + 1), 1).forEach((n) => {
    line(n, top, n, bottom);
  });
  range(floor(top), floor(bottom + 1), 1).forEach((n) => {
    line(left, n, right, n);
  });

  /// draw axis
  stroke(0);
  noFill();
  line(left, 0, right, 0);
  line(0, top, 0, bottom);

  /// draw playback head
  stroke(0);
  noFill();
  line(playbackHead, top, playbackHead, bottom);

  /// draw legend
  const scale = 1 / drawZoom;
  const here = -scrollOffset / drawZoom;

  /// ticks
  noFill();
  stroke("black");

  if (drawZoom > 8) {
    line(1, -0.5, 1, 0.9);
    line(TWO_PI, -0.5, TWO_PI, 0.9);
    line(10, -0.5, 10, 0.9);
    line(100, -0.5, 100, 0.9);
  }
  if (here < 0 || here > 10) {
    line(here, -0.5, here, 0.9);
  }

  /// labels
  const labelY = 96;
  textSize(20 * scale);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  fill("black");
  stroke("white");
  strokeWeight(6 * scale);

  if (drawZoom > 8) {
    text("1", 1, (labelY + 2) * scale);
    text("2π", TWO_PI, (labelY + 2) * scale);
    text("10", 10, (labelY + 2) * scale);
    text("100", 100, (labelY + 2) * scale);
  }
  if (here < 0 || here > 10) {
    text(floor(here * 10) / 10, here, (labelY + 2) * scale);
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

function plot(expression = "x") {
  // this commented code allows for B, C, D to reference A
  // it works, but finishing this so everything can reference everything
  // at least to a point, is out of scope for now.
  // function run(f, ...args) {
  //   try {
  //     return f(...args);
  //   } catch (e) {
  //     return false;
  //   }
  // }
  // function buildExpression(expression = "x") {
  //   try {
  //     return new Function("x", `return (${expression})`);
  //   } catch (e) {
  //     return undefined;
  //   }
  // }
  // const fA = buildExpression(
  //   editors.find((e) => e.id === "A").expressionEl.value(),
  // );

  // "compile" the expression
  let f;
  try {
    f = new Function("x", `return (${expression})`);
  } catch (e) {
    e.severity = "warn";
    e.message = "invalid expression";
    return e;
  }

  let error = false;

  // plot the expression
  try {
    push();
    noFill();
    beginShape();
    const left = (-512 - scrollOffset) / drawZoom;
    const right = (512.1 - scrollOffset) / drawZoom;
    range(left, right, 1 / drawZoom).forEach((x) => {
      vertex(x, f(x));
    });
  } catch (e) {
    e.severity = "error";
    error = e;
  } finally {
    endShape();
    pop();
    return error;
  }
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

function runCode() {
  const code = codeEditor.getValue();

  push();
  translate(width * 0.5, height * 0.5);
  scale(drawZoom + 0.01);
  fill("red");
  strokeWeight(1 / drawZoom);
  noStroke();
  try {
    // eval
    const A = 1;
    eval(code);
  } catch (e) {
    console.error(e);
  } finally {
    pop();
  }
}
// ellipse(1,1,1,1)
