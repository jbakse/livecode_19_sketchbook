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

function step(dT, t) {
  x = (x + 480 * dT) % canvas.width;
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(x, canvas.height * 0.5 - 50, 100, 100);
}

function onFrame(t) {
  // calculate the change in time
  let dT = t - (onFrame.oldT || 0);
  onFrame.oldT = t;

  // pass the change in time and the time in seconds
  step(dT / 1000, t / 1000);
  draw();
  //done with this one, request another one, forever!
  window.requestAnimationFrame(onFrame);
}

// run setup once
setup();

// kick off animation
window.requestAnimationFrame(onFrame);
