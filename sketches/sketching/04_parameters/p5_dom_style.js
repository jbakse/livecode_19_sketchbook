// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// create a style element and stick it on the page
// we could just put these styles in the css for the page too
// i'm just doing it this way to keep everything in one file
const n = document.createElement("style");
document.head.append(n);
n.innerHTML = `
canvas {
  border: 10px solid red;
}
input[type=range] {
  -webkit-appearance: none;
  margin: 18px 0;
  width: 100px;
}
`;

let slider;
function setup() {
  createCanvas(600, 600);
  slider = createSlider(0, 255, 128);
}

function draw() {
  background(slider.value());
}
