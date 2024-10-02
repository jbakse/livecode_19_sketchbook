// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw */

let zoom = 1024 / 16;
let drawZoom = zoom;

const editors = [
  { id: "Z", color: "#AAA", defaultValue: "noise(x)", defaultChecked: true },
  { id: "A", color: "#07D", defaultValue: "x", defaultChecked: true },
  { id: "B", color: "#7D7", defaultValue: "cos(x)", defaultChecked: false },
  { id: "C", color: "#D0D", defaultValue: "fract(x)", defaultChecked: false },
  { id: "D", color: "#D70", defaultValue: "-fract(x)", defaultChecked: false },
];

let shared;

id = Math.random();

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "signals", "main");
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(1024, 512).parent("canvas-wrap");

  if (partyIsHost()) {
    shared.mode = "unsynced";
  }

  editors.forEach(createEditor);

  const codeEl = select("#code");
  codeEl.input(redraw);

  loadInputs();

  partyWatchShared(shared, "mode", onModeChanged);
  onModeChanged();

  canvas.addEventListener("wheel", onMouseWheel, {
    passive: false,
  });

  noLoop();
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
    shared.presenter !== id;

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
    select("#editor-Z").toggleClass("secret");
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
  // drawZoom = lerp(drawZoom, zoom, 0.25);
  // if (abs(zoom - drawZoom) < 1) drawZoom = zoom;

  drawZoom = zoom;

  background("white");

  drawGraph(inputValue);
  drawAllVis(inputValue);

  runCode();

  storeInputs();
}

function storeInputs() {
  window.localStorage.setItem("expressionZ", editors[0].expressionEl.value());
  window.localStorage.setItem("expressionA", editors[1].expressionEl.value());
  window.localStorage.setItem("expressionB", editors[2].expressionEl.value());
  window.localStorage.setItem("expressionC", editors[3].expressionEl.value());
  window.localStorage.setItem("expressionD", editors[4].expressionEl.value());
  window.localStorage.setItem("code", codeEditor.getValue());
}

function loadInputs() {
  editors[0].expressionEl.value(window.localStorage.getItem("expressionZ"));
  editors[1].expressionEl.value(window.localStorage.getItem("expressionA"));
  editors[2].expressionEl.value(window.localStorage.getItem("expressionB"));
  editors[3].expressionEl.value(window.localStorage.getItem("expressionC"));
  editors[4].expressionEl.value(window.localStorage.getItem("expressionD"));
  
  const savedCode = window.localStorage.getItem("code") || "// hi";
  window.codeEditor = CodeMirror(document.getElementById("code"), {
    value: savedCode,
    mode: "javascript",
    lineNumbers: true,
    theme: "default",
    autofocus: true
  });
  
  codeEditor.on("change", () => {
    window.localStorage.setItem("code", codeEditor.getValue());
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
    range(-512 / drawZoom, 512.1 / drawZoom, 1 / drawZoom).forEach((x) => {
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
