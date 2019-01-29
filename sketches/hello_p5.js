console.log("hi!");

window.setup = function() {
  console.log("i'm setup!");
  createCanvas(600, 400);
  background(50, 50, 50);
};

window.draw = function() {
  fill(255, 0, 0);
  ellipse(300, 300, 100, 100);
};
