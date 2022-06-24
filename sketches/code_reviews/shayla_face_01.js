// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js

const eyes = [];
let nose;
const mouth = [];
const a = 2;

const canvSize = 600;

// this piece of the code (and wherever it's applied as a variable) is adapted from https://compform.net/parameters/'s Tweakpane example
const params = {
  background: { r: 180, g: 190, b: 215 },
  tiredness: 3,
  smile: 3,
  faceWidth: 1,
  faceHeight: 1,
};

const pane = new Tweakpane.Pane();

pane.addInput(params, "background");
pane.addInput(params, "tiredness", { min: 0, max: 6, step: 1 });
pane.addInput(params, "smile", { min: 0, max: 5, step: 1 });
pane.addInput(params, "faceWidth", { min: 0.3, max: 1.33 });
pane.addInput(params, "faceHeight", { min: 0.3, max: 1.33 });

function preload() {
  // load images into an array of eyes
  for (let i = 0; i < 7; i++) {
    eyes[i] = loadImage(`imageAssets/eyes/Eyes${i + 1}.png`);
  }

  // load nose image
  nose = loadImage("imageAssets/nose/Nose1.png");

  // load images into an array of mouths
  for (let i = 0; i < 6; i++) {
    mouth[i] = loadImage(`imageAssets/mouth/mouth${i + 1}.png`);
  }
}

function setup() {
  createCanvas(canvSize, canvSize + 50);

  imageMode(CENTER);
  translate(width / 2, height / 2);
}

function draw() {
  // I referenced Zora's sketch https://compform.net/js_lab/js_lab.html?https://sketches2022spring.compform.net/posts/opz9ogYc5bd9cK3k6/code to figure out this part of Tweakpane
  background(params.background.r, params.background.g, params.background.b);

  push();
  translate(width / 2, height / 2);
  scale(params.faceWidth, 1);
  scale(1, params.faceHeight);

  push();
  image(eyes[params.tiredness], 0, 0, canvSize, canvSize);
  pop();

  push();
  image(nose, 0, 0, canvSize, canvSize);
  pop();

  push();
  image(mouth[params.smile], 0, 0, canvSize, canvSize);
  pop();
  pop();
}
