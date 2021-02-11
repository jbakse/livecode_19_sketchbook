// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.plot.ly/plotly-latest.min.js

// this is the sin random trick, i first saw on book of shaders
// sampling on most numbers gives really good random results
// but if you sample on a multiple of PI it falls apart
// still stick to ints, and its good

function sinRand(n) {
  const f = Math.abs(_fract(Math.sin(n * 100000) * 100000));
  return f;
}
function _fract(x) {
  return x - Math.trunc(x);
}

let nn = 0;
function sinRandomInt(min, max, n = nn++) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(sinRand(n) * (max - min) + min);
}
function randomInt(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

const randoms = [];
const sinRandoms = [];

function setup() {
  createCanvas(512, 256);

  background(200);
  fill(200, 0, 0, 50);
  noStroke();
  for (let x = 0; x < 5120; x += 0.01) {
    const n = randomInt(0, 50);
    randoms.push(n);
    rect(x, 50 - n, 1, 1);
  }

  for (let x = 0; x < 5120; x += 0.01) {
    const n = sinRandomInt(0, 50, x * 1); //anything but PI!
    sinRandoms.push(n);
    rect(x, 150 - n, 1, 1);
  }
  console.log(sinRandomInt(0, 50, 0.1) === sinRandomInt(0, 50, 0.1));

  const p = document.createElement("div");
  p.id = "plotly";
  document.body.appendChild(p);

  Plotly.newPlot("plotly", [
    {
      x: randoms,
      type: "histogram",
    },
    {
      x: sinRandoms,
      type: "histogram",
    },
  ]);
}
