// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js

/* globals paper*/
/* exported downloadSVG*/

/*
         ┌───────┐
         │       │
         │ front │
      gf │       │  gf
  ┌──────┼───────┼──────┐
  │      │       │      │
 f│left  │bottom │right │f
  │      │       │      │
  └──────┼───────┼──────┘
      gf │       │  gf
         │back   │
         │       │
         ├───────┤
         │       │
         │top    │
         │       │
         └───────┘
             f
*/

const INCH = 72;

// create a canvas and attach paper to it
function setup() {
  const paper_canvas = document.createElement("canvas");
  paper_canvas.setAttribute("width", "800");
  paper_canvas.setAttribute("height", "800");
  document.body.append(paper_canvas);
  paper.setup(paper_canvas);
}

// downloads the paper drawing as svg
// adapted from https://compform.net/vectors/
function downloadSVG(fileName) {
  // use default name if not provided
  fileName = fileName || "output.svg";

  // create a data url of the file
  var svgData = paper.project.exportSVG({ bounds: "content", asString: true });
  var url = "data:image/svg+xml;utf8," + encodeURIComponent(svgData);

  // create an off-document link to the data, and "click" it
  var link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
}

// center view on `target` item, and zoom to fit
function showItem(target = paper.project.activeLayer) {
  paper.project.view.center = target.bounds.center;
  paper.paper.view.zoom = 1;
  paper.project.view.zoom = Math.min(
    paper.project.view.bounds.height / target.bounds.height,
    paper.project.view.bounds.width / target.bounds.width
  );
}

const TYPE_STYLE = {
  fontFamily: "Roboto", // must be loaded from html/css before use
  fontWeight: 100,
  fontSize: 0.5 * INCH,
  fillColor: "black",
};

// creates the common element for each side (the double border)
function generateSide(size) {
  const g = new paper.Group({ name: "side" });

  const back_r = new paper.Rectangle(0, 0, size.width, size.height);
  const r = new paper.Path.Rectangle(back_r);
  r.fillColor = "#ddd";
  g.addChild(r);

  const r2 = new paper.Path.Rectangle(back_r.expand(-0.5 * INCH, -0.5 * INCH));
  r2.fillColor = "#eee";
  g.addChild(r2);

  const r3 = new paper.Path.Rectangle(back_r.expand(-1.0 * INCH, -1.0 * INCH));
  r3.fillColor = "#fff";
  g.addChild(r3);

  return g;
}

// creates the front. starts with generateSide() then adds text
function generateFront(size) {
  const g = generateSide(size);

  const text = new paper.PointText(
    new paper.Point(0.5 * INCH, size.height - 0.5 * INCH)
  );
  text.style = TYPE_STYLE;
  text.content = "example - front";
  g.addChild(text);

  return g;
}

// creates the back. starts with generateSide() then adds text
function generateBack(size) {
  const g = generateSide(size);

  const text = new paper.PointText(
    new paper.Point(0.5 * INCH, size.height - 0.5 * INCH)
  );
  text.style = TYPE_STYLE;
  text.content = "example - back";
  g.addChild(text);

  return g;
}

function onInput() {
  const width = document.getElementById("width").value * INCH;
  const height = document.getElementById("height").value * INCH;
  const depth = document.getElementById("depth").value * INCH;

  // validate inputs here
  console.log(width, height, depth);
  regenerate(width, height, depth);
  showItem(paper.project.activeLayer);
}

function regenerate(width, height, depth) {
  const space = 0.5 * INCH;
  paper.project.activeLayer.removeChildren();

  const front = generateFront(new paper.Size(width, height));
  front.bounds.top = 0;

  const back = generateBack(new paper.Size(width, height));
  back.bounds.top = (height + space) * 1;

  const left = generateSide(new paper.Size(depth, height));
  left.name = "left";
  left.bounds.top = (height + space) * 2;

  const right = generateSide(new paper.Size(depth, height));
  right.name = "right";
  right.bounds.top = (height + space) * 3;

  const top = generateSide(new paper.Size(width, depth));
  top.name = "top";
  top.bounds.top = (height + space) * 4;

  const bottom = generateSide(new paper.Size(width, depth));
  bottom.name = "bottom";
  bottom.bounds.top = (height + space) * 4 + depth + space;
}
function main() {
  console.log("main");
  setup();

  document.getElementById("width").addEventListener("input", onInput);
  document.getElementById("height").addEventListener("input", onInput);
  document.getElementById("depth").addEventListener("input", onInput);

  document.getElementById("download").addEventListener("click", () => {
    downloadSVG("box.svg");
  });

  onInput();
}

window.addEventListener("load", main);
