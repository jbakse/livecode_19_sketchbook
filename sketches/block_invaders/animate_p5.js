// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let x = 0;

window.setup = function () {
  createCanvas(480, 640);
};

window.draw = function () {
  background("black");
  fill("red");
  x = (x + 10) % width;
  rect(x, height * 0.5 - 50, 100, 100);
};
