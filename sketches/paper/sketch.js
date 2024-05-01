console.log("hello, paper.js");
window.onload = function () {
  console.log("window.onload");
  // Get a reference to the canvas object
  const canvas = document.getElementById("myCanvas");
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);
  // Create a Paper.js Path to draw a line into it:
  const path = new paper.Path();
  // Give the stroke a color
  path.strokeColor = "black";
  const start = new paper.Point(100, 100);
  // Move to start and draw a line from there
  path.moveTo(start);
  // Note that the plus operator on Point objects does not work
  // in JavaScript. Instead, we need to call the add() function:
  path.lineTo(start.add([200, -50]));
  // Draw the view now:
  paper.view.draw();
};
