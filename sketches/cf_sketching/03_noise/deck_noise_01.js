// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.plot.ly/plotly-latest.min.js

// const deck = ["teeth", "teeth", "birds"];
const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// _shuffle(deck);

//https://softwareengineering.stackexchange.com/questions/147134/how-should-i-test-randomness
//https://en.wikipedia.org/wiki/Diehard_tests
//https://github.com/davidbau/seedrandom
//https://github.com/chancejs/chancejs
//https://github.com/nastyox/Rando.js#nastyox

function deckNoise(n) {
  const i = Math.floor(sinRand(n) * deck.length);
  return deck[i];
}

function sinRand(n) {
  const f = Math.abs(_fract(Math.sin(n) * 100000));
  return f;
}

function _shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1); //Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

function setup() {
  createCanvas(512, 256);
  noLoop();
}

function draw() {
  background(200);
  fill(200, 0, 0, 25);
  noStroke();
  for (let x = 0; x < 5120; x += 0.1) {
    const n = deckNoise(x) * 4;
    rect(x, 200, 1, -n);
  }
}

const p = document.createElement("div");
p.id = "plotly";
document.body.appendChild(p);

var values = [];
var sum = 0;
for (var i = 0; i < 10000; i++) {
  values.push(deckNoise(i));
  sum += sinRand(i) / 10000;
}
console.log(sum);

function _fract(x) {
  return x - Math.trunc(x);
}
var trace = {
  x: values,
  type: "histogram",
};
var data = [trace];

Plotly.newPlot("plotly", data);
