// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Point Color Rectangle*/

var cactus_colors = ["#3D3", "#3DD", "#DD3", "#AAA"];

function a(r) {
  if (random() < 0.5) {
    var c = new Path.Ellipse(r);
    c.fillColor = pick(cactus_colors);
    c.shadowColor = new Color(0, 0, 0, 0.2);
    c.shadowBlur = 12;
    c.shadowOffset = new Point(5, 5);
  }

  if (r.width < 10) return;

  if (random() < 0.75) a(new Rectangle(r.topLeft, r.size * 0.5));
  if (random() < 0.75) a(new Rectangle(r.topCenter, r.size * 0.5));
  if (random() < 0.75) a(new Rectangle(r.leftCenter, r.size * 0.5));
  if (random() < 0.75) a(new Rectangle(r.center, r.size * 0.5));
}

a(new Rectangle([10, 10, 490, 490]));

function pick(a) {
  return a[randomInt(a.length)];
}

function randomInt(min, max) {
  return Math.floor(random(min, max));
}

function random(min, max) {
  var _min = min;
  var _max = max;
  if (max == undefined) {
    _min = 0;
    _max = min;
  }
  if (min == undefined) {
    _min = 0;
    _max = 1;
  }

  return Math.random() * (_max - _min) + _min;
}
