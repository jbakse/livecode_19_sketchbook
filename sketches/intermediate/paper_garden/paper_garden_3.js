// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-full.min.js
// paperscript
/*eslint no-undef: 0*/

var WIDTH = 600;
var HEIGHT = 600;
var CLUSTER_COUNT = 18;
var CLUSTER_RADIUS = 130;
var DOT_COUNT = 70;
var DOT_RADIUS = 18;

createClusters();
project.activeLayer.scale(0.5);

function createClusters() {
  var cluster_points = [];
  var i;

  // randomly place clusters around drawing
  for (i = 0; i < CLUSTER_COUNT; i++) {
    cluster_points.push(
      new Point(randomRange(0, WIDTH), randomRange(0, HEIGHT))
    );
  }

  // relax them a bit
  relaxPoints(
    cluster_points,
    CLUSTER_RADIUS * 1.5,
    false,
    CLUSTER_RADIUS * 0.1,
    10
  );

  // remove a few to create some gaps
  cluster_points.shift();
  cluster_points.shift();
  cluster_points.shift();
  cluster_points.shift();
  cluster_points.shift();

  // sort top to bottom
  cluster_points.sort(function(a, b) {
    return a.y < b.y ? -1 : 1;
  });

  for (i = 0; i < cluster_points.length; i++) {
    var point = cluster_points[i];
    createCluster(point);
  }
}

function createCluster(cluster_point) {
  var dot_points = [];
  var i;

  // randomly place points around 0,0
  for (i = 0; i < DOT_COUNT; i++) {
    dot_points.push(randomPoint() * CLUSTER_RADIUS * 0.5);
  }

  // relax them a bit
  relaxPoints(dot_points, DOT_RADIUS * 1.4, false, DOT_RADIUS * 0.1, 100);

  // sort by distance from 0,0
  dot_points.sort(function(a, b) {
    return a.length < b.length ? 1 : -1;
  });

  var types = ["leaf", "vine", "vine", "flower", "flower"];
  var type = pick(types);
  if (type === "leaf") createLeafPlant(cluster_point, dot_points);
  if (type === "flower") createFlowerPlant(cluster_point, dot_points);
  if (type === "vine") createVinePlant(cluster_point, dot_points);
}

function createFlowerPlant(cluster_point, dot_points) {
  for (i = 0; i < dot_points.length; i++) {
    var dot_point = dot_points[i];
    if (chance(0.3)) {
      createFlower(cluster_point, dot_point);
    } else {
      createDot(cluster_point, dot_point, DOT_RADIUS);
    }
  }
}

function createVinePlant(cluster_point, dot_points) {
  for (i = 0; i < dot_points.length; i++) {
    var dot_point = dot_points[i];
    if (chance(0.3)) {
      createVine(cluster_point, dot_point);
      createDot(cluster_point, dot_point, DOT_RADIUS);
    } else {
      createDot(cluster_point, dot_point, DOT_RADIUS);
    }
  }
}

function createLeafPlant(cluster_point, dot_points) {
  base_color = new Color(0.1, 0.5, 0.15, 1);
  tint = Math.min(randomRange(0, 0.2), randomRange(0, 0.2));
  tint_color = new Color(tint, tint, tint, 0);
  cluster_color = base_color - tint_color;

  for (i = 0; i < dot_points.length; i++) {
    var dot_point = dot_points[i];
    createDot(cluster_point, dot_point, DOT_RADIUS);
  }
}

function createDot(cluster_point, dot_point, r) {
  var back_path = new Path.Circle(cluster_point + dot_point, r + 2);

  back_path.translate(randomPoint() * 2);

  back_path.style = {
    fillColor: new Color(1, 1, 1, 1),
    shadowColor: new Color(1, 1, 1, 1),
    shadowBlur: 4,
    shadowOffset: new Point(randomRange(-1, 1), randomRange(1, 1)),
  };

  var path = new Path.Circle(cluster_point + dot_point, r);
  var pressure = randomRange(-0.5, 0.5);
  path.style = {
    strokeColor: new Color(0.3, 0.3, 0.3) + new Color(0.1, 0.1, 0.1) * pressure,
    strokeWidth: 1 - pressure * 0.1,
  };

  //   path.clone().translate(randomPoint() * 0.3);

  return { path: path, back_path: back_path };
}

function createFlower(cluster_point, dot_point) {
  var d = dot_point / 5;
  var p = dot_point;
  var i;

  for (i = 0; i < 5; i++) {
    var r = map(i, 0, 5, DOT_RADIUS, DOT_RADIUS * 0.25);
    paths = createDot(cluster_point, p, r);

    d = d + [0, 5];
    d *= 0.8;
    p += d;
  }

  d = dot_point / 5;
  p = dot_point;
  for (i = 0; i < 5; i++) {
    r = map(i, 0, 5, DOT_RADIUS, DOT_RADIUS * 0.25);
    paths = createDot(cluster_point, p, r * 0.5);
    paths.path.remove();
    d = d + [0, 5];
    d *= 0.8;
    p += d;
  }
}

function createVine(cluster_point, dot_point) {
  var i;
  var length = Math.min(randomRange(10, 40), randomRange(10, 40));
  var offset_x = 0;
  for (i = 0; i < length; i++) {
    var offset_point = [offset_x, i * DOT_RADIUS * 0.6];
    offset_x += randomRange(-5, 5);
    createDot(cluster_point, dot_point + offset_point, DOT_RADIUS * 0.4);
  }
}

//////////////////////////////////////////
// util

// function unite(a) {
//   console.log(a);
//   var path = a[0];
//   path.remove();
//   var i;
//   for (i = 1; i < a.length; i++) {
//     a[i].remove();
//     console.log(i, a.length);
//     path = path.unite(a[i]);
//   }
//   project.activeLayer.addChild(path);
//   return path;
// }

function map(x, inMin, inMax, outMin, outMax) {
  var n = (x - inMin) / (inMax - inMin);
  return n * (outMax - outMin) + outMin;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPoint() {
  return new Point(randomRange(-1, 1), randomRange(-1, 1));
}

function chance(t) {
  return Math.random() < t;
}

function pick(a) {
  var i = Math.floor(Math.random() * a.length);
  return a[i];
}

function relaxPoints(points, min, max, stepSize, steps) {
  min = min * min;
  max = max * max;
  for (step = 0; step < steps; step++) {
    for (i1 = 0; i1 < points.length; i1++) {
      for (i2 = 0; i2 < points.length; i2++) {
        if (i1 === i2) continue;
        p1 = points[i1];
        p2 = points[i2];
        var n = (p1 - p2).normalize();
        var dist = p1.getDistance(p2, true);
        if (dist < min) {
          p1 = p1 + n * stepSize;
          p2 = p2 - n * stepSize;
        }
        if (max && dist > max) {
          p1 = p1 - n * stepSize;
          p2 = p2 + n * stepSize;
        }
        points[i1] = p1;
        points[i2] = p2;
      }
    }
  }
}
