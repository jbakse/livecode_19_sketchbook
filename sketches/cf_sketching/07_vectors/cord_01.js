// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Color*/

var l = new Path.Line([100, 460], [412, 460]);
l.strokeColor = "#880";
l.strokeWidth = 10;

var c = new Path.Ellipse(128, 128, 256, 256);
c.strokeColor = "#088";
c.strokeWidth = 10;
c.flatten(0.5);
c.selected = true;

for (i = 0; i < c.segments.length; i++) {
  s = c.segments[i];

  s.deltaY = 0;
}
function onFrame() {
  for (i = 0; i < c.segments.length; i++) {
    s = c.segments[i];
    s.deltaY += 0.1;
    s.point.y += s.deltaY;

    if (s.point.y > 450) {
      s.deltaY = -Math.abs(s.deltaY) * 0.9;
      s.point.y = 450;
    }
  }
  c.smooth();
}
