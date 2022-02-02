// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// move the mouse around alot and reload the page
// can mouseMoved be called before preload? - no / expected
// can mouseMoved be called before preload is done? - yes / undesired
// can mouseMoved be called before setup? - yes / undesired
// can mouseMoved be called before the first draw? - yes / expected
let img;
function preload() {
  console.log("preload");
  img = loadImage("https://placekitten.com/g/200/300");
}
function setup() {
  console.log("setup", img.width);
  createCanvas(512, 512);
}

function draw() {
  console.log("draw", img.width);
  background("gray");
  noLoop();
}

function mouseMoved() {
  console.log("mouseMoved", img.width);
}

function mousePressed() {
  // happens on mousePressed too, but harder to click fast enough
  console.log("mousePressed", img.width);
}
