// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Color*/
var TENSION = 0.2;

var l = new Path.Line([100, 460], [412, 460]);
l.strokeColor = "#880";
l.strokeWidth = 10;

var c = new Path.Ellipse(128, 128, 256, 256);
c.strokeColor = "#088";
c.strokeWidth = 10;
c.flatten(0.5);
c.selected = true;

for (i = 0; i < c.segments.length; i++) {
  s1 = c.segments[i];
  s1.deltaY = 0;
  s1.next = c.segments[mod(i + 3, c.segments.length)];
  s1.prev = c.segments[mod(i - 3, c.segments.length)];
  s1.nextDist = dist(s1.point, s1.next.point);
  s1.prevDist = dist(s1.point, s1.prev.point);
  s1.originalPoint = s1.point.clone();
}
// next, create an array of springs instead of having the springs
// locked right into the segments

function onFrame() {
  // c.segments[10].point.y = c.segments[10].originalPoint.y;
  // c.segments[10].point.x = c.segments[10].originalPoint.x;
  for (i = 0; i < c.segments.length; i++) {
    s1 = c.segments[i];

    // gravity
    s1.deltaY += 0.1;
    s1.point.y += s1.deltaY;

    // drag
    s1.deltaY *= 0.9;

    {
      var d = dist(s1.point, s1.next.point);
      var dX = (s1.next.point.x - s1.point.x) / d;
      var dY = (s1.next.point.y - s1.point.y) / d;
      s1.next.point.x = lerp(
        s1.next.point.x,
        s1.point.x + dX * s1.nextDist,
        TENSION
      );
      s1.next.point.y = lerp(
        s1.next.point.y,
        s1.point.y + dY * s1.nextDist,
        TENSION
      );
    }

    {
      var d = dist(s1.point, s1.prev.point);
      var dX = (s1.prev.point.x - s1.point.x) / d;
      var dY = (s1.prev.point.y - s1.point.y) / d;
      s1.prev.point.x = lerp(
        s1.prev.point.x,
        s1.point.x + dX * s1.prevDist,
        TENSION
      );
      s1.prev.point.y = lerp(
        s1.prev.point.y,
        s1.point.y + dY * s1.prevDist,
        TENSION
      );
    }

    // floor
    if (s1.point.y > 450) {
      s1.deltaY = -Math.abs(s1.deltaY) * 0.9;
      s1.point.y = 450;
    }
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
