/*eslint no-undef: 0*/

var width = 1000;
var height = 1000;
var cluster_count = 100;
var cluster_radius = 120;
var dot_count = 60;
var dot_radius = 18;

// var clusters = [];

createClusters();

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
  for (i = 0; i < dot_points.length; i++) {
    var plant_point = dot_points[i];
    createPlant(cluster_point, plant_point);
  }
}

function createPlant(cluster_point, plant_point, tint) {
  var path = new Path.Circle(cluster_point + plant_point, dot_radius);
  tint = Math.min(randomRange(0, 0.05), randomRange(0, 0.05));
  path.style = {
    fillColor: new Color(1 - tint, 1 - tint, 1 - tint),
    shadowColor: new Color(0, 0, 0, 0.3),
    shadowBlur: 16,
    shadowOffset: new Point(randomRange(-2, 2), randomRange(0.5, 2))
  };
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPoint() {
  return new Point(randomRange(-1, 1), randomRange(-1, 1));
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
