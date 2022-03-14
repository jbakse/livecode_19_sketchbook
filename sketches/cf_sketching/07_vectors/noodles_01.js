// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Color*/

var p = new Path();
p.strokeColor = "red";

p.moveTo(100, 0);
for (var i = 1; i < 10; i++) {
  var r = Math.random() + 0.25;
  p.lineTo(100, i * 50);
  p.lineTo(100 + r * 50, i * 50);
  p.lineTo(100 + r * 50, i * 50 + 25);

  p.lineTo(100, i * 50 + 25);
}

var p2 = p.clone();
p2.strokeColor = "green";

p2.smooth();
