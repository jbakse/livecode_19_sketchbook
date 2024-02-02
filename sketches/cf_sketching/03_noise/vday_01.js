// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

console.log("Hi");

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 1);
}

function draw() {
  background("red");

  drawHeart();
  pop();
  mirror();
}

function drawHeart() {
  push();
  noStroke();
  translate(width * 0.5, height * 0.3);
  rotate(PI);
  scale(-1, 1);

  for (let i = 0; i < 200; i += 25) {
    fill("black");
    drawPass(20, i, i);
  }
  for (let i = 0; i < 200; i += 25) {
    fill("white");
    drawPass(10, i, i);
  }
}

function drawPass(thickness = 20, noiseAmount = 50, noiseZ = 0) {
  for (let a = 0.5 * PI; a < 1.5 * PI; a += 0.002) {
    const x =
      cos(a) * 125 * heart(a) + (noise(a * 10, 0, noiseZ) - 0.5) * noiseAmount;
    const y =
      sin(a) * 125 * heart(a) + (noise(a * 10, 1, noiseZ) - 0.5) * noiseAmount;
    ellipse(x, y, thickness, thickness);
  }
}

function heart(a) {
  // heart function from Pavel Panchekha
  // https://pavpanchekha.com/blog/heart-polar-coordinates.html
  return (sin(a) * sqrt(abs(cos(a)))) / (sin(a) + 7 / 5) - 2 * sin(a) + 2;
}

function mirror() {
  scale(-1, 1);
  copy(0, 0, width * 0.5, height, -800, 0, width * 0.5, height);
}
