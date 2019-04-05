/*eslint no-undef: 0*/

var width = 600;
var height = 600;
var cluster_count = 10;
var cluster_radius = 130;
var dot_count = 70;
var dot_radius = 18;

// var bounds = new Rectangle(new Point(0, 0), new Point(width, height));
// var rectangle = new Path.Rectangle(bounds);
// rectangle.fillColor = "#EEE";

createClusters();
// project.activeLayer.scale(0.25);

function createClusters() {
  var cluster_points = [];
  var i;
  for (i = 0; i < cluster_count; i++) {
    cluster_points.push(
      new Point(randomRange(0, width), randomRange(0, height))
    );
  }
  relaxPoints(
    cluster_points,
    cluster_radius * 1.5,
    false,
    cluster_radius * 0.1,
    10
  );

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
  for (i = 0; i < dot_count; i++) {
    // console.log(cluster_point, cluster_point + randomPoint * cluster_radius);
    dot_points.push(randomPoint() * cluster_radius * 0.5);
  }
  relaxPoints(dot_points, dot_radius * 1.4, 0, dot_radius * 0.1, 100);
  dot_points.sort(function(a, b) {
    return a.length < b.length ? 1 : -1;
  });

  var types = ["leaf", "vine", "flower", "vine"];
  var type = pick(types);

  if (type === "leaf") createLeafPlant(cluster_point, dot_points);
  if (type === "flower") createFlowerPlant(cluster_point, dot_points);
  if (type === "vine") createVinePlant(cluster_point, dot_points);
}

function createFlowerPlant(cluster_point, dot_points) {
  base_color = new Color(0.1, 0.5, 0.15, 1);
  tint = Math.min(randomRange(0, 0.2), randomRange(0, 0.2));
  tint_color = new Color(tint, tint, tint, 0);
  cluster_color = base_color - tint_color;

  if (chance(0.5)) {
    flower_color = new Color(0.7, 0.1, 0.1);
  } else {
    flower_color = new Color(1, 1, 1);
  }
  for (i = 0; i < dot_points.length; i++) {
    var dot_point = dot_points[i];
    if (chance(0.2)) {
      createFlower(cluster_point, dot_point, flower_color);
    } else {
      createDot(cluster_point, dot_point, cluster_color);
    }
  }
}

function createVinePlant(cluster_point, dot_points) {
  base_color = new Color(0.1, 0.5, 0.15, 1);
  tint = Math.min(randomRange(0, 0.2), randomRange(0, 0.2));
  tint_color = new Color(tint, tint, tint, 0);
  cluster_color = base_color - tint_color;

  vine_color = cluster_color * 1.1;

  for (i = 0; i < dot_points.length; i++) {
    var dot_point = dot_points[i];
    if (chance(0.3)) {
      createVine(cluster_point, dot_point, vine_color);
      createDot(cluster_point, dot_point, cluster_color);
    } else {
      createDot(cluster_point, dot_point, cluster_color);
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
    createDot(cluster_point, dot_point, cluster_color);
  }
}

function createDot(cluster_point, dot_point, cluster_color) {
  var path = new Path.Circle(cluster_point + dot_point, dot_radius);
  tint = Math.min(randomRange(0, 0.05), randomRange(0, 0.05));
  tint_color = new Color(tint, tint, tint, 0);
  dot_color = cluster_color - tint_color;
  //   path.style = {
  //     fillColor: dot_color,
  //     shadowColor: new Color(0, 0, 0, 0.3),
  //     shadowBlur: 16,
  //     shadowOffset: new Point(randomRange(-2, 2), randomRange(0.5, 2))
  //   };
  path.style = {
    fillColor: "white",
    strokeColor: "black",
    shadowColor: new Color(1, 1, 1, 1),
    shadowBlur: 5,
    shadowOffset: new Point(randomRange(-1, 1), randomRange(1, 1))
  };
  path.clone();
  path.clone();
  path.clone();
  path.clone();
  path.clone();
  path.clone();
}

function createFlower(cluster_point, dot_point, base_color) {
  tint = Math.min(randomRange(0, 0.05), randomRange(0, 0.05));
  tint_color = new Color(tint, tint, tint, 0);
  flower_color = base_color - tint_color;

  var d = dot_point / 100;
  var i;
  var paths = [];
  for (i = 0; i < 10; i++) {
    var path = new Path.Circle(
      cluster_point + dot_point,
      map(i, 0, 10, dot_radius, dot_radius * 0.25)
    );
    // path.style = {
    //   fillColor: flower_color,
    //   shadowColor: new Color(0, 0, 0, 0.1),
    //   shadowBlur: 16,
    //   shadowOffset: new Point(randomRange(-2, 2), randomRange(0.5, 2))
    // };
    path.style = {
      fillColor: "white",
      strokeColor: "black",
      shadowColor: new Color(1, 1, 1, 1),
      shadowBlur: 2,
      shadowOffset: new Point(randomRange(-1, 1), randomRange(1, 1))
    };
    path.clone();
    path.clone();
    path.clone();
    path.clone();
    path.clone();
    path.clone();
    paths.push(path);
    d = d + [0, 0.02];
    dot_point += d * i;
  }
  //  var path = unite(paths);
}

function createVine(cluster_point, dot_point, base_color) {
  tint = Math.min(randomRange(0, 0.05), randomRange(0, 0.05));
  tint_color = new Color(tint, tint, tint, 0);
  flower_color = base_color - tint_color;

  var i;
  var paths = [];
  var length = Math.min(randomRange(10, 40), randomRange(10, 40));
  var offset_x = 0;
  for (i = 0; i < length; i++) {
    var offset_point = [offset_x, i * dot_radius * 0.6];
    offset_x += randomRange(-5, 5);
    var path = new Path.Circle(
      cluster_point + dot_point + offset_point,
      dot_radius * 0.4
    );
    // path.style = {
    //   fillColor: flower_color,
    //   shadowColor: new Color(0, 0, 0, 0.3),
    //   shadowBlur: 16,
    //   shadowOffset: new Point(randomRange(-2, 2), randomRange(0.5, 2))
    // };
    path.style = {
      fillColor: "white",
      strokeColor: "black",
      shadowColor: new Color(1, 1, 1, 1),
      shadowBlur: 5,
      shadowOffset: new Point(randomRange(-1, 1), randomRange(1, 1))
    };
    path.clone();
    path.clone();
    path.clone();
    path.clone();
    path.clone();
    path.clone();
    paths.push(path);
  }
  //  var path = unite(paths);
}

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
