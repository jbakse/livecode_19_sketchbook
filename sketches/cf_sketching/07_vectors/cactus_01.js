// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js
// paperscript

/* globals Path Group Color*/
var bowl_colors = ["#9FF", "#99F", "#999", "#F99"];
var cactus_colors = ["#3D3", "#3DD", "#DD3", "#AAA"];

for (var row = 0; row < 4; row++) {
  for (var col = 0; col < 5; col++) {
    var g = new Group();
    g.pivot = [0, 0];

    var bowl_size = randomInt(30, 60);

    // make bowl
    g.addChild(makeBowl(bowl_size));

    // make cacti
    for (var x = -bowl_size * 0.5 + 4; x < bowl_size * 0.5 - 12; x += 8) {
      if (Math.random() < 0.5) continue;
      g.addChild(makeCactus(random(10, bowl_size)));
    }

    g.position.x = col * 100 + 50;
    g.position.y = row * 120 + 75;
    g.rotate(random(-20, 20));
  }
}

function makeBowl(bowl_size) {
  var r = new Path.Rectangle(
    -bowl_size * 0.5,
    -bowl_size * 0.5,
    bowl_size,
    bowl_size * 0.5
  );
  var c = new Path.Ellipse(
    -bowl_size * 0.5,
    -bowl_size * 0.5,
    bowl_size,
    bowl_size
  );
  var bowl = c.subtract(r);
  r.remove();
  c.remove();
  bowl.fillColor = pick(bowl_colors);
  return bowl;
}

function makeCactus(h) {
  var r = new Path.Rectangle(x, -h, 12, h);
  var c = new Path.Ellipse(x, -h - 5, 12, 12);
  var cactus = r.unite(c);
  r.remove();
  c.remove();
  cactus.fillColor = pick(cactus_colors);
  return cactus;
}
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
