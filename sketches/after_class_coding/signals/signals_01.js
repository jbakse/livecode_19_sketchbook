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

// code-controls toggle state
let runCodeEnabled = false;

// drag state
let isDragging = false;
let dragStartX;
let scrollOffset = 0;

// settings for the experession editors
// these objects will also store refrences to the DOM elements

const editors = [
  {
    id: "Z",
    color: "#AAA",
    f: null,
    defaultValue: "noise(x)",
    defaultChecked: true,
  },
  {
    id: "A",
    color: "#07D",
    f: null,
    defaultValue: "x",
    defaultChecked: true,
  },
  {
    id: "B",
    color: "#7D7",
    f: null,
    defaultValue: "cos(x)",
    defaultChecked: false,
  },
  {
    id: "C",
    color: "#D0D",
    f: null,
    defaultValue: "fract(x)",
    defaultChecked: false,
  },
  {
    id: "D",
    color: "#D70",
    f: null,
    defaultValue: "-fract(x)",
    defaultChecked: false,
  },
];

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "signals", "main");
  shared = partyLoadShared("shared", { mode: "unsynced", presenter: partyId });
}

function setup() {
  createCanvas(1024, 512).parent("canvas-wrap");

  /// setup dom
  editors.forEach(createEditor);
  createCodeEditor();
  canvas.addEventListener("wheel", onMouseWheel, { passive: false });
  canvas.addEventListener("mousedown", onStartDragging);
  canvas.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDragging);
  window.addEventListener("keydown", onKeyPressed);
  select("#animate-checkbox").changed(onToggleAnimation);
  window.focus();

  /// local storage
  loadInputs();

  /// p5.party
  partyWatchShared(shared, "mode", onModeChanged);
  onModeChanged();
}

function draw() {
  /// determine input type/value
  let visInput;
  const visType = select("#input-select").value();
  if (visType === "frameCount") visInput = frameCount;
  if (visType === "frameCount60") visInput = frameCount / 60;
  if (visType === "millis") visInput = millis();
  if (visType === "millis1000") visInput = (millis() / 1000) % 10;
  if (visType === "mouseX") visInput = mouseX;
  if (visType === "mouseXZoom") visInput = (mouseX - 512 - scrollOffset) / zoom;

  /// smooth zoom changes
  drawZoom = lerp(drawZoom, zoom, 0.25);
  if (abs(zoom - drawZoom) < 1) drawZoom = zoom;

  /// draw
  background("white");
  push();
  translate(scrollOffset, 0);
  drawGraph(visInput);
  runCodeEnabled && runCode();

  pop();
  drawAllVis(visInput);

  //todo: refactor this, storeInputs should be called on input change, not draw
  //todo: maybe break input storage up so each change is stored individually
  storeInputs();
}

/// DOM setup
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
      <div class="toggle">
        <input 
          type="checkbox" 
          id="plot-${editor.id}" 
          
          ${editor.defaultChecked ? "checked" : ""}
        >
        <label for="plot-${editor.id}">P</label>
      </div>
    </div>
  `;

  select("#editors").elt.insertAdjacentHTML("beforeend", editorHTML);

  const editorEl = select(`#editor-${editor.id}`);
  editor.expressionEl = select(`#expression-${editor.id}`, editorEl);
  editor.plotEl = select(`#plot-${editor.id}`, editorEl);
  editor.errorEl = select(".error", editorEl);

  // load intial value from local storage
  editor.expressionEl.value(
    localStorage.getItem(`expression${editor.id}`) ?? editor.defaultValue,
  );

  // load intial value from shared
  // if (shared[editor.id]) editor.expressionEl.value(shared[editor.id]);

  // update function
  updateEditorFunction(editor);

  // listen for changes to expression
  editor.expressionEl.input(onExpressionInput.bind(editor));

  // listen for changes to plot checkbox
  editor.plotEl.input(redraw);

  // watch for changes to shared value
  partyWatchShared(shared, editor.id, onExpressionChanged.bind(editor));
}

function createCodeEditor() {
  codeEditor = CodeMirror(document.getElementById("code"), {
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

  codeEditor.on("change", () => {
    localStorage.setItem("code", codeEditor.getValue());
    redraw();
  });

  // Add event listener for code-controls toggle
  select("#show-code").changed(() => {
    runCodeEnabled = select("#show-code").checked();
    redraw();
  });
}

/// Event Handlers
function onStartDragging(event) {
  isDragging = true;
  dragStartX = event.clientX - scrollOffset;
}

function onDrag(event) {
  if (!isDragging) return;
  const x = event.clientX - dragStartX;
  scrollOffset = x;
  redraw();
}

function stopDragging() {
  isDragging = false;
}

function onToggleAnimation() {
  select("#animate-checkbox").checked() ? loop() : noLoop();
}

function onModeChanged() {
  const inputsDisabled = shared.mode === "presenting" &&
    shared.presenter !== partyId;

  for (editor of editors) {
    editor.expressionEl.elt.disabled = inputsDisabled;
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

// change from p5pary
function onExpressionChanged(newValue) {
  console.log("expression sync", newValue);
  this.expressionEl.value(newValue);
  updateEditorFunction(this);
  redraw();
}

// change from local ui
function onExpressionInput(e) {
  if (shared.mode === "presenting" || shared.mode === "synced") {
    shared[this.id] = this.expressionEl.value();
  }
  localStorage.setItem(`expression${this.id}`, this.expressionEl.value());
  updateEditorFunction(this);
  redraw();
}

function onMouseWheel(event) {
  changeZoom(event.deltaY);
  event.preventDefault();
}

function onKeyPressed(e) {
  const isModifierPressed = e.ctrlKey || e.metaKey;
  const key = e.key || e.code;

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

  /// presenter hotkey "p"
  if (isModifierPressed && key.toLowerCase() === "p") {
    if (shared.mode === "presenting") {
      shared.presenter = undefined;
      shared.mode = "synced";
    } else if (shared.mode === "synced") {
      shared.presenter = undefined;
      shared.mode = "unsynced";
    } else if (shared.mode === "unsynced") {
      shared.presenter = partyId;
      shared.mode = "presenting";
    }
    e.preventDefault();
    return false;
  }
}

/// State management
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

/// Local Storage Sync
function storeInputs() {
  localStorage.setItem("code", codeEditor.getValue());
}

function loadInputs() {
  codeEditor.setValue(localStorage.getItem("code") ?? "");
}

/// Graph Layer
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
    if (editor.plotEl.checked() && editor.f) {
      stroke(editor.color);
      strokeWeight(3 / drawZoom);

      const error = plot(editor.f);
      editor.errorEl.html(error?.message ?? "");
    }
  }

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
  const here = (512 - 32 - scrollOffset) / drawZoom;

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
    text("1", 1, labelY * scale);
    text("2π", TWO_PI, labelY * scale);
    text("10", 10, labelY * scale);
    text("100", 100, labelY * scale);
  }
  if (here < 0 || here > 10) {
    text(floor(here * 10) / 10, here, labelY * scale);
  }

  // text(playbackHead.toFixed(1), playbackHead + 32 * scale, 64 * 3 * scale);

  pop();
}

function plot(f) {
  if (!f) { message: "f is not a function"; }
  try {
    push();
    noFill();
    beginShape();
    const left = (-512 - scrollOffset) / drawZoom;
    const right = (512 + 1 - scrollOffset) / drawZoom;
    range(left, right, 1 / drawZoom).forEach((x) => {
      vertex(x, f(x));
    });
  } catch (e) {
    return e;
  } finally {
    endShape();
    pop();
  }
}

/// Visualization Layer
function drawAllVis(inputValue = 0) {
  const inputSelectEl = select("#input-select");
  const input = inputSelectEl.value();
  const outputSelectEl = select("#output-select");
  const output = outputSelectEl.value();
  if (input === "none" || output === "none") return;

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

/// Dynamic evaluation stuff

function updateEditorFunction(editor) {
  // console.log("update expression", editor.id, editor.expressionEl.value());

  let error = null;
  try {
    editor.f = new Function("x", `return (${editor.expressionEl.value()})`);
    editor.errorEl.html("");
  } catch (e) {
    console.log("error", e);
    editor.f = null;
    e.message = "invalid expression";
    error = e;
    editor.errorEl.html(error?.message ?? "");
  }
}

function yForX(e = "x", x) {
  try {
    f = Function("x", `return (${e})`);
    return f(x);
  } catch (e) {
    return undefined;
  }
}

function runCode() {
  const code = codeEditor.getValue();

  push();
  translate(width * 0.5, height * 0.5);
  scale(drawZoom + 0.01);
  scale(1, -1);
  fill("red");
  strokeWeight(1 / drawZoom);
  noStroke();
  try {
    // eval
    const zero = () => 0;
    const A = editors.find((e) => e.id === "A").f ?? zero;
    const B = editors.find((e) => e.id === "B").f ?? zero;
    const C = editors.find((e) => e.id === "C").f ?? zero;
    const D = editors.find((e) => e.id === "D").f ?? zero;
    const Z = editors.find((e) => e.id === "Z").f ?? zero;
    eval(code);
  } catch (e) {
    console.error(e);
  } finally {
    pop();
  }
}

/// utility

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


/*
x % 10 < 5
abs(sin(x * 1.7)) + abs(sin(x)) + 1

//background("black");
for (let x = 0; x < 100; x++) {
  fill("gray");
  rect(x - 0.25, D(x), 0.5, -D(x));
  if (C(x)) {
  	fill("red");
  	rect(x - 0.25, D(x), 0.5, 0.1);
  }
}

*