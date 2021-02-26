console.log("Hello, Canvas");

const canvas = document.createElement("canvas");
canvas.id = "block-invaders";
canvas.width = 480;
canvas.height = 640;
document.body.appendChild(canvas);

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
const ctx = canvas.getContext("2d");

// clear to transparent black
ctx.clearRect(0, 0, canvas.width, canvas.height);

// clear to color
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// draw a rect
ctx.fillStyle = "red";
ctx.fillRect(canvas.width * 0.5 - 50, canvas.height * 0.5 - 50, 100, 100);
