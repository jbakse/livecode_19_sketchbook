// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* eslint-disable */

function draw() {
  var circle1 = new Path.Circle([100, 100], 50);
  circle1.strokeColor = "red";
  var circle2 = new Path.Circle([140, 100], 50);
  circle2.strokeColor = "red";
  var circle3 = new Path.Circle([180, 100], 50);
  circle3.strokeColor = "red";

  var unitedCircles = unite([circle1, circle2, circle3]);
  // unitedCircles.strokeColor = "blue";

  // var circles = [];
  // for (var i = 0; i < 10; i++) {
  //   var c = new Path.Circle([random(100, 200), random(200, 300)], 30);
  //   c.strokeColor = "red";
  //   circles.push(c);
  // }
  // var unitedCircles2 = unite(circles);
  // unitedCircles2.strokeColor = "blue";
}

draw();

function random(low, high) {
  return low + Math.random() * (high - low);
}

// takes shapes provied in array `a`, removes them, unites them, puts result on the active layer and returns it
function unite(a) {
  var path = a[0];
  path.remove();

  for (var i = 1; i < a.length; i++) {
    a[i].remove();
    path = path.unite(a[i]);
  }
  project.activeLayer.addChild(path);
  return path;
}
