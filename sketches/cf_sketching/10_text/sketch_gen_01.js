const colors = [
  "black",
  "white",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "blue",
  "indigo",
  "violet",
];
const sketch = `
function setup() {
    createCanvas(128, 128);
    noLoop();
}
function draw() {
    background("${pick(colors)}");
    ${drawStuff()}
}
`;

function drawStuff() {
  console.log("hi");
  const r = Math.random();

  if (r < 0.2) return drawSet() + drawStuff();
  if (r < 0.4) return drawOne() + drawStuff();
  if (r < 0.6) return drawSet();
  if (r < 1.0) return drawOne();
}

function drawSet() {
  let value = `${setFill()} ${setStroke()}\n`;
  const c = Math.random() * 5;
  for (let i = 0; i < c; i++) {
    value += `${drawShape()}\n`;
  }
  return value;
}

function drawOne() {
  return `
    ${setFill()}
    ${setStroke()}
    ${drawShape()}
 `;
}

function setFill() {
  return pick(["noFill();", `fill("${pick(colors)}");`]);
}

function setStroke() {
  return pick([
    "noStroke();",
    `stroke("${pick(colors)}"); strokeWeight(${pick([1, 2, 4])});`,
  ]);
}

function drawShape() {
  return `${shapeFunction()}(${loc()}, ${size()});`;
}

function loc() {
  return pick([
    "random(width), random(height)",
    "width * .5, height * .5",
    "0, 0",
  ]);
}

function size() {
  let w = pick([1, 2, 4, 8, 16, 32, 64, 128]);
  w = p(0.5) ? w : `random(${w})`;
  let h = pick([1, 2, 4, 8, 16, 32, 64, 128]);
  h = p(0.5) ? h : `random(${h})`;
  h = p(0.5) ? h : w;
  return `${w}, ${h}`;
}
function shapeFunction() {
  return pick(["ellipse", "rect"]);
}

function p(percent) {
  return Math.random() < percent;
}

console.log(sketch);

function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}
