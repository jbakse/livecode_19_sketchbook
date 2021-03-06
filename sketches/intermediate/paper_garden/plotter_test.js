// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-full.min.js
// paperscript

/*global project Point Group Path Color dat*/

////////////////////////////////////////////////
// drawing settings
var GAPPY = 2;
var SLOPPY = 2;
var SHADOW_BLUR = 0;
var ROUGH = 0.1;
var STROKE = 1.0;

draw();
function draw() {
  project.activeLayer.removeChildren();

  drawCircle([280, 290], 50);
  drawCircle([330, 300], 50);
  drawCircle([310, 340], 50);
  //   drawing.push(drawCircle([330, 350], 50, drawing));
}

function drawCircle(center, radius) {
  // create backing blocker
  var back_path = new Path.Circle(center, radius + GAPPY);
  back_path.name = "back";
  back_path.translate(randomPoint() * SLOPPY);
  back_path.style = {
    fillColor: new Color(1, 0, 0, 0.1),
    shadowColor: new Color(1, 1, 1, 1),
    shadowBlur: SHADOW_BLUR,
    shadowOffset: 0,
  };
  back_path.remove();

  // create stroke circle
  var path = new Path.Circle(center, radius);
  path.name = "front";
  path.style = {
    strokeColor: "black",
  };

  for (var s = 0; s < path.segments.length; s++) {
    path.segments[s].point += randomPoint() * ROUGH * radius;
  }
  path.remove();

  console.log(project.activeLayer.children);
  var children = project.activeLayer.children;
  for (var i = 0; i < children.length; i++) {
    // if (children[i] === path) continue;
    // if (children[i] === back_path) continue;

    subtract(children[i], back_path);
    subtract(children[i], path);
  }

  path.addTo(project.activeLayer);

  return path;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPoint() {
  return new Point(randomRange(-1, 1), randomRange(-1, 1));
}

////////////////////////////////////////////////////
// Set up sliders
var settings = {
  GAPPY: GAPPY,
  SLOPPY: SLOPPY,
  SHADOW_BLUR: SHADOW_BLUR,
  ROUGH: ROUGH,
  STROKE: STROKE,
};

var gui = new dat.GUI();
gui.add(settings, "GAPPY", 0, 20).onChange(update);
gui.add(settings, "SLOPPY", 0, 20).onChange(update);
gui.add(settings, "SHADOW_BLUR", 0, 20).onChange(update);
gui.add(settings, "ROUGH", 0, 1).onChange(update);
gui.add(settings, "STROKE", 0, 20).onChange(update);

function update() {
  GAPPY = settings.GAPPY;
  SLOPPY = settings.SLOPPY;
  SHADOW_BLUR = settings.SHADOW_BLUR;
  ROUGH = settings.ROUGH;
  STROKE = settings.STROKE;
  draw();
}

function subtract(a, b) {
  if (!b.closed) {
    return false;
  }
  if (a.closed) {
    a.splitAt(0);
  }
  var crossings = a.getCrossings(b);

  var kept = [];
  var removed = [];
  for (var i = crossings.length - 1; i >= 0; i--) {
    var splitPart = a.splitAt(crossings[i].offset);
    if (b.contains(splitPart.getPointAt(splitPart.length * 0.5))) {
      splitPart.remove();
      removed.push(splitPart);
    } else {
      kept.push(splitPart);
    }
  }
  if (b.contains(a.getPointAt(a.length * 0.5))) {
    a.remove();
    removed.push(a);
  } else {
    kept.push(a);
  }

  return {
    kept: kept,
    removed: removed,
  };
}
