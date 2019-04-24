// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-full.min.js
// paperscript

/*global project Point Group Path Color dat*/

////////////////////////////////////////////////
// drawing settings

function onMouseMove(e) {
  console.log(e);
  draw(e);
}
function draw(e) {
  //   var line = new Path.Line([10, 10], [100, 100]);
  project.activeLayer.removeChildren();
  var line = new Path.Rectangle([100, 100], [50, 50]);
  line.strokeColor = "blue";
  line.strokeWidth = 3;
  var circle = new Path.Circle(e.point, [100, 30]);
  circle.strokeColor = "black";

  var result = subtract(line, circle);

  for (var i = 0; i < result.removed.length; i++) {
    project.activeLayer.addChild(result.removed[i]);
    result.removed[i].strokeColor = "red";
    result.removed[i].strokeWidth = 1;
  }
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
