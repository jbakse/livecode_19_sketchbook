// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js

/* globals paper*/
function setup() {
  const paper_canvas = document.createElement("canvas");
  paper_canvas.setAttribute("width", "800");
  paper_canvas.setAttribute("height", "800");
  document.body.append(paper_canvas);
  paper.setup(paper_canvas);
}

setup();

// const back_r = new paper.Rectangle(100, 100, 100, 100);
const r = new paper.Path.Rectangle(100, 100, 10, 100);
r.fillColor = "#f00";

console.log(r);
