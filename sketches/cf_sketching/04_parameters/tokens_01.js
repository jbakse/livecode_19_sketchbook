// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js

/* exported setup draw */
/* global Tweakpane */

loadGoogleFont(
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap"
);

const params = {
  primaryC: "#fff",
  accentC: "#f90",
  label: "DM",
  shape: "ellipse",
};

const pane = new Tweakpane.Pane();
pane.on("change", draw);

pane.addInput(params, "primaryC");
pane.addInput(params, "accentC");
pane.addInput(params, "label");
pane.addInput(params, "shape", {
  options: {
    circle: "ellipse",
    square: "rect",
  },
});
pane.addButton({ title: "Randomize" }).on("click", () => {
  console.log("?");

  params.primaryC = random(["#fff", "#000", "#f00", "#0f0", "#00f"]);
  params.accentC = random(["#fff", "#000", "#f00", "#0f0", "#00f"]);
  params.label = random(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
  params.shape = random(["circle", "square"]);
  pane.refresh();
});

function setup() {
  createCanvas(600, 300);

  noFill();
  noStroke();
  textFont("DM Sans");
  rectMode(CENTER);

  noLoop(); // draw on tweaks only, save some cpu/battery
  setTimeout(draw, 100); // wait for fonts to load, quick and dirty
}

function draw() {
  background(40);

  for (let i = 0; i < 5; i++) {
    const scale = pow(0.5, i); // 1, .5, .25, .125, .0625
    const x = 520 - (scale * 256 * 1.5 - i * 20);
    const y = 150;
    // const y = pow(0.5, i) * 1.5 * 512;
    push();
    translate(x, y);
    drawToken(scale * 256);
    pop();
  }
}

function drawToken(d = 256) {
  push();

  const outerD = d;
  const innerD = d - map(d, 0, 256, 3, 30);

  const primaryBrightness = brightness(color(params.primaryC));
  const contrastColor = primaryBrightness < 50 ? "white" : "black";

  // this little trick with the shapeFunction is silly
  // but i thought it might be a fun after we talked about
  // functions the other day
  const shapeFunction = window[params.shape];
  fill(params.accentC);
  shapeFunction(0, 0, outerD, outerD);
  fill(params.primaryC);
  shapeFunction(0, 0, innerD, innerD);

  fill(contrastColor);

  textSize((innerD / 256) * 130);
  textAlign(CENTER, CENTER);
  text(params.label, 0, (innerD / 256) * 13);

  pop();
}

function loadGoogleFont(href) {
  const link = document.createElement("link");

  link.href = href;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}
