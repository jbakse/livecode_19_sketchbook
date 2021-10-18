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
const TAB_WIDTH = 0.5 * INCH;
// const DEBUG = false;

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
  paper.project.view.zoom = Math.min(
    paper.project.view.bounds.height / target.bounds.height,
    paper.project.view.bounds.width / target.bounds.width
  );
}

// create a box template with given dimensions
function makeBoxPattern(width, height, depth) {
  // front
  const front_r = new paper.Rectangle(height, 0, width, height);
  const front = new paper.Path.Rectangle(front_r);
  front.name = "front";
  front.fillColor = "red";

  // bottom
  const bottom_r = new paper.Rectangle(height, height, width, depth);
  const bottom = new paper.Path.Rectangle(bottom_r);
  bottom.name = "bottom";
  bottom.fillColor = "orange";

  // back
  const back_r = new paper.Rectangle(height, height + depth, width, height);
  const back = new paper.Path.Rectangle(back_r);
  back.name = "back";
  back.fillColor = "yellow";

  // top
  const top_r = new paper.Rectangle(
    height,
    height + depth + height,
    width,
    depth
  );
  const top = new paper.Path.Rectangle(top_r);
  top.name = "top";
  top.fillColor = "green";

  // left
  const left_r = new paper.Rectangle(0, height, height, depth);
  const left = new paper.Path.Rectangle(left_r);
  left.name = "left";
  left.fillColor = "blue";

  // right
  const right_r = new paper.Rectangle(height + width, height, height, depth);
  const right = new paper.Path.Rectangle(right_r);
  right.name = "right";
  right.fillColor = "indigo";

  // top_tab_1
  const top_tab_1 = makeTab(
    new paper.Rectangle(
      height,
      height + depth + height + depth,
      width,
      TAB_WIDTH
    )
  );
  top_tab_1.rotation = 180;
  top_tab_1.name = "top_tab_1";

  // left_tab_1
  const left_tab_1 = makeTab(
    new paper.Rectangle(0, height - TAB_WIDTH, height, TAB_WIDTH)
  );
  left_tab_1.name = "left_tab_1";

  // left_tab_2
  const left_tab_2 = makeTab(
    new paper.Rectangle(0, height + depth, height, TAB_WIDTH)
  );
  left_tab_2.rotation = 180;
  left_tab_2.name = "left_tab_2";

  // left_tab_3
  const left_tab_3 = makeTab(new paper.Rectangle(0, 0, depth, TAB_WIDTH));
  left_tab_3.rotation = -90;
  left_tab_3.position = new paper.Point(-TAB_WIDTH * 0.5, height + depth * 0.5);
  left_tab_3.name = "left_tab_3";

  // right_tab_1
  const right_tab_1 = makeTab(
    new paper.Rectangle(height + width, height - TAB_WIDTH, height, TAB_WIDTH)
  );
  right_tab_1.name = "right_tab_1";

  // right_tab_2
  const right_tab_2 = makeTab(
    new paper.Rectangle(height + width, height + depth, height, TAB_WIDTH)
  );
  right_tab_2.rotation = 180;
  right_tab_2.name = "right_tab_2";

  // right_tab_3
  const right_tab_3 = makeTab(new paper.Rectangle(0, 0, depth, TAB_WIDTH));
  right_tab_3.rotation = 90;
  right_tab_3.position = new paper.Point(
    height + width + height + TAB_WIDTH * 0.5,
    height + depth * 0.5
  );
  right_tab_3.name = "right_tab_3";

  // group + style
  const box = new paper.Group({
    name: "box",
    children: [
      front,
      bottom,
      back,
      top,
      left,
      right,
      top_tab_1,
      left_tab_1,
      left_tab_2,
      left_tab_3,
      right_tab_1,
      right_tab_2,
      right_tab_3,
    ],
    strokeColor: "black",
    strokeWidth: 0.5,
    fillColor: null,
  });

  return box;
}

// create an up-pointing tab in `bounds`
// bounds should be at least twice as wide as it is tall
function makeTab(bounds) {
  const tab = new paper.Path.Rectangle(bounds);
  tab.segments[1].point.x += bounds.height;
  tab.segments[2].point.x -= bounds.height;
  tab.fillColor = "violet";
  return tab;
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

function main() {
  console.log("main");
  setup();

  const pattern = makeBoxPattern(6 * INCH, 4 * INCH, 3 * INCH);
  showItem(pattern);

  const front = generateFront(pattern.children.front.bounds.size);
  front.bounds.point = pattern.children.front.bounds.point;

  const back = generateBack(pattern.children.back.bounds.size);
  back.bounds.point = pattern.children.back.bounds.point;
  back.rotation = 180;

  const left = generateSide(pattern.children.left.bounds.size);
  left.name = "left";
  left.bounds.point = pattern.children.left.bounds.point;

  const right = generateSide(pattern.children.right.bounds.size);
  right.name = "right";
  right.bounds.point = pattern.children.right.bounds.point;

  const top = generateSide(pattern.children.top.bounds.size);
  top.name = "top";
  top.bounds.point = pattern.children.top.bounds.point;

  const bottom = generateSide(pattern.children.bottom.bounds.size);
  bottom.name = "bottom";
  bottom.bounds.point = pattern.children.bottom.bounds.point;

  // downloadSVG("box.svg");
}

window.addEventListener("load", main);
