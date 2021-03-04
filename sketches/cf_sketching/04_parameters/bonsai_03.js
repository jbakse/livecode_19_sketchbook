// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// draws little trees using recursion
// each tree is drawn using parameter chosen "randomly"
// from ranges tweaked in tweakpane

/* global Tweakpane */
const pane = new Tweakpane();
const params = {
  max_branchAngle: 0.25,
  max_branchAt: 5,
  max_life: 30,
  max_twisting: 0.21,
  max_yearning: 0.5,
  max_branchChance: 1.0,

  min_branchAngle: 0.01,
  min_branchAt: 3,
  min_life: 15,
  min_twisting: 0,
  min_yearning: 0,
  min_branchChance: 0.5,
};

window.setup = function () {
  createCanvas(600, 600);
  noiseSeed(2);
  noiseDetail(8);

  pane.addFolder({
    title: "Minimums",
  });

  pane.addInput(params, "min_yearning", {
    label: "yearning",
    min: -1,
    max: 1,
    step: 0.01,
  });
  pane.addInput(params, "min_twisting", {
    label: "twisting",
    min: 0,
    max: 1,
    step: 0.01,
  });
  pane.addInput(params, "min_branchAngle", {
    label: "branchA",
    min: 0.01,
    max: 0.5,
    step: 0.01,
  });
  pane.addInput(params, "min_branchAt", {
    label: "branchAt",
    min: 3,
    max: 10,
    step: 1,
  });
  pane.addInput(params, "min_branchChance", {
    label: "branchC",
    min: 0,
    max: 1,
    step: 0.01,
  });
  pane.addInput(params, "min_life", {
    label: "life",
    min: 5,
    max: 30,
    step: 1,
  });

  pane.addFolder({
    title: "Maximums",
  });

  pane.addInput(params, "max_yearning", {
    label: "yearning",
    min: -1,
    max: 1,
    step: 0.01,
  });
  pane.addInput(params, "max_twisting", {
    label: "twisting",
    min: 0,
    max: 1,
    step: 0.01,
  });
  pane.addInput(params, "max_branchAngle", {
    label: "branchA",
    min: 0.01,
    max: 0.5,
    step: 0.01,
  });
  pane.addInput(params, "max_branchAt", {
    label: "branchAt",
    min: 3,
    max: 10,
    step: 1,
  });
  pane.addInput(params, "max_branchChance", {
    label: "branchC",
    min: 0,
    max: 1,
    step: 0.01,
  });
  pane.addInput(params, "max_life", {
    label: "life",
    min: 5,
    max: 30,
    step: 1,
  });

  // redraw when the params change
  pane.on("change", draw);
  // disable draw loop
  noLoop();
  // draw once though
  draw();
  // redrawing only when params change greatly reduces
  // processor load
};

function draw() {
  background(200);
  noFill();
  stroke(50, 128);
  strokeWeight(0.5);

  let id = 0;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      push();
      {
        translate(col * 100 + 50, row * 100 + 75);
        line(-30, 0, 30, 0);
        tree(id);
      }
      pop();
      id++;
    }
  }

  noLoop();
}
let leafId;
function tree(id, x = 0, y = 0, dX = 0, dY = -2, life) {
  let step = 0;

  const _yearning = noiseRange(params.min_yearning, params.max_yearning, id);
  const _twisting = noiseRange(params.min_twisting, params.max_twisting, id);
  const _branchAt = noiseInt(params.min_branchAt, params.max_branchAt + 1, id);
  const _life = noiseInt(params.min_life, params.max_life + 1, id);
  const _branchAngle = noiseRange(
    params.min_branchAngle,
    params.max_branchAngle,
    id
  );
  const _branchChance = noiseRange(
    params.min_branchChance,
    params.max_branchChance,
    id
  );

  if (life === undefined) {
    life = _life;
    leafId = 0;
  }

  while (life > 0) {
    const oldX = x;
    const oldY = y;
    x += dX;
    y += dY;
    dX += noiseRange(-2, 2, id, life) * _twisting;
    dY += noiseRange(-2, 2, id, life) * _twisting;
    dX *= 1 - 0.1 * _yearning;
    dY *= 1 + 0.1 * _yearning;
    life--;
    step++;

    // strokeWeight(r);
    stroke(0);
    line(oldX, oldY, x, y);

    if (step == _branchAt) {
      if (noise(id, life, 1) < _branchChance) {
        const [dX1, dY1] = rotateXY(
          dX,
          dY,
          PI * _branchAngle * noiseRange(0.5, 1, id, life, 1)
        );
        tree(id, x, y, dX1, dY1, life);
      }
      if (noise(id, life, 2) < _branchChance) {
        const [dX2, dY2] = rotateXY(
          dX,
          dY,
          PI * -_branchAngle * noiseRange(0.5, 1, id, life, 2)
        );
        tree(id, x, y, dX2, dY2, life - 1);
      }
      break;
    }
  }
  if (life < _branchAt * 2 + 1) {
    push();
    colorMode(HSB, 1);

    let c = noise(id) * 10 + noise(leafId) * 0.2;
    fill(c % 1, 1, map(life, 0, _branchAt, 1, 0.5));
    noStroke();
    // for (let l = 0; l < 1; l++) {
    push();
    translate(
      x + noiseRange(-5, 5, leafId, 1),
      y + noiseRange(-5, 5, leafId, 2)
    );
    rotate(atan2(dX, -dY));
    ellipse(0, 0, 5, 10);
    pop();
    leafId++;
    // }
    pop();
  }
}

function rotateXY(x, y, dA) {
  const a = atan2(x, y);
  const d = dist(0, 0, x, y);
  return [sin(a + dA) * d, cos(a + dA) * d];
}

function noiseRange(min, max, ...a) {
  return noise(...a) * (max - min) + min;
}

function noiseInt(min, max, ...a) {
  return floor(noise(...a) * (max - min) + min);
}

// function noiseZero(x, y, z) {
//   return noise(x, y, z) * 2 - 1;
// }

// function times(t, f) {
//   let a = [];
//   for (let i = 0; i < t; i++) {
//     a.push(f(i));
//   }
//   return a;
// }
