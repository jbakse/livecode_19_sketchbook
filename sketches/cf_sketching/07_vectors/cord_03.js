// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Color*/
var TENSION = 0.2;

var l = new Path.Line([0, 460], [512, 460]);
l.strokeColor = "#880";
l.strokeWidth = 10;

var c = new Path.Ellipse(128, 128, 256, 256);
c.strokeColor = "#088";
c.strokeWidth = 10;
c.flatten(0.5);
c.selected = true;

var springs = [];

// init segments
for (i = 0; i < c.segments.length; i++) {
  s1 = c.segments[i];
  s1.deltaY = 0;
}

// attach springs
for (i = 0; i < c.segments.length; i++) {
  var s1 = {};
  s1.p1 = c.segments[i].point;
  s1.p2 = c.segments[mod(i + 1, c.segments.length)].point;
  s1.length = dist(s1.p1, s1.p2);
  s1.tension = 0.2;
  springs.push(s1);
}

console.log(springs);
// next, create an array of springs instead of having the springs
// locked right into the segments

function onFrame() {
  var i;
  for (i = 0; i < c.segments.length; i++) {
    s = c.segments[i];
    // gravity
    // s.deltaY += 0.1;
    // s.point.y += s.deltaY;

    s.point.x += (Math.random() - 0.5) * 10;
    s.point.y += (Math.random() - 0.5) * 10;

    // drag
    s.deltaY *= 0.99;
    // floor
    if (s.point.y > 450) {
      s.deltaY = -Math.abs(s.deltaY) * 0.9;
      s.point.y = 450;
    }
  }
  for (i = 0; i < springs.length; i++) {
    var s = springs[i];
    var d = dist(s.p1, s.p2);
    var dX = (s.p2.x - s.p1.x) / d;
    var dY = (s.p2.y - s.p1.y) / d;
    s.p2.x = lerp(s.p2.x, s.p1.x + dX * s.length, s.tension);
    s.p2.y = lerp(s.p2.y, s.p1.y + dY * s.length, s.tension);
  }
  c.smooth();
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
