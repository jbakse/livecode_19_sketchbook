// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Color*/

// a tiny little noise system

var noiseA = [];

function initNoise() {
  for (var x = 0; x < 10; x++) {
    noiseA[x] = [];
    for (var y = 0; y < 10; y++) {
      noiseA[x][y] = Math.random();
    }
  }
}

// returns simple value noise with range [-1, 1)
function noise(x, y) {
  if (!noiseA.length) initNoise();

  var x1 = Math.floor(x) % 10;
  var y1 = Math.floor(y) % 10;
  var x2 = Math.ceil(x) % 10;
  var y2 = Math.ceil(y) % 10;
  var sx = x - Math.floor(x);
  var sy = y - Math.floor(y);
  var u = lerp(noiseA[x1][y1], noiseA[x2][y1], sx);
  var v = lerp(noiseA[x1][y2], noiseA[x2][y2], sx);
  var l = lerp(u, v, sy);

  return l * 2 - 1;
}

function lerp(a, b, n) {
  return a + (b - a) * n;
}

// make a little thing
var p = new Path();
p.strokeColor = "#f0f";
p.strokeWidth = 10;
p.fillColor = "#a6a";

var i;

for (i = 0; i < 360; i += 20) {
  var innerR = 100;
  var a = Math.random() * 20 + 20;
  var b = a * 2;
  p.add(250 + sin(i) * innerR, 250 + cos(i) * innerR);
  p.add(250 + sin(i) * (innerR + a), 250 + cos(i) * (innerR + a));
  p.add(250 + sin(i) * (innerR + b), 250 + cos(i) * (innerR + b));
  p.add(250 + sin(i + 10) * (innerR + b), 250 + cos(i + 10) * (innerR + b));
  p.add(250 + sin(i + 10) * (innerR + a), 250 + cos(i + 10) * (innerR + a));
  p.add(250 + sin(i + 10) * innerR, 250 + cos(i + 10) * innerR);
}
p.closed = true;

// warp the little thing with noise
for (i = 0; i < p.segments.length; i++) {
  var s = p.segments[i];
  var f = 0.01;
  var x = s.point.x * f;
  var y = s.point.y * f;
  s.point.x += noise(x, y) * 30;
  s.point.y += noise(x + 5, y) * 30;
}

// finish up
p.smooth();
// p.selected = true;

function radians(degrees) {
  return degrees * (Math.PI / 180);
}

function sin(a) {
  return Math.sin(radians(a));
}

function cos(a) {
  return Math.cos(radians(a));
}
