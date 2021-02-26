console.log("Hello, Canvas");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
let x = 0;

function setup() {
  canvas.id = "block-invaders";
  canvas.width = 480;
  canvas.height = 640;
  document.body.appendChild(canvas);
}

function step() {
  x = (x + 10) % canvas.width;
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(x, canvas.height * 0.5 - 50, 100, 100);
}

function onFrame(t) {
  // t is the time of the frame
  // a more sophisticated example would consider t
  // see DOMHighResTimeStamp

  step();
  draw();
  //done with this one, request another one, forever!
  window.requestAnimationFrame(onFrame);
}

// run setup once
setup();

// kick off animation
window.requestAnimationFrame(onFrame);
