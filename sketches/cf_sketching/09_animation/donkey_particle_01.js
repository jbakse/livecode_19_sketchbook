// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js

const Q = 100; // set to 1 for full quality
const PARTICLE_COUNT = 1000000 / Q;
let particles = [];

window.setup = function () {
  pixelDensity(1);
  createCanvas(1280, 720);
  background(50, 50, 50);
  particles = generateParticles(PARTICLE_COUNT);
  frameRate(30);
};

function step() {
  for (const p of particles) {
    p.dX += field(p.x, p.y).x * 0.01;
    p.dY += field(p.x, p.y).y * 0.01;
    // p.dX += 0.01;
    p.x += p.dX;
    p.y += p.dY;
  }
}
window.draw = function () {
  for (const i in range(1, 10)) {
    step();
  }

  //   drawField();
  drawParticles();
  //   drawFPS();

  console.log(frameCount);

  // saveFrame("render", frameCount, "png", 90);
};

function drawParticles() {
  push();
  background(0);
  noStroke();
  blendMode(ADD);
  const r = map(frameCount, 30, 60, 1, 2, true);
  const a = map(frameCount, 0, 85, 8, 0, true) * Q;
  fill(a);
  for (const p of particles) {
    ellipse(p.x, p.y, r, r);
    ellipse(p.x, p.y, r * 2, r * 2);
  }
  pop();
}

function drawField() {
  push();
  stroke("red");
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const f = field(x, y);

      line(x, y, x + f.x * 10, y + f.y * 10);
    }
  }
  pop();
}

function field(x, y) {
  noiseDetail(1, 0.5);
  const f = 0.02;
  return {
    x: map(noise(x * f, y * f, 0), 0, 0.5, -1, 1),
    y: map(noise(x * f, y * f, 1), 0, 0.5, -1, 1),
  };
}

let fpsArray = [];
function drawFPS() {
  push();
  noStroke();
  fill(255);
  const f = frameRate();
  if (f) fpsArray.push(f);
  if (fpsArray.length > 30) fpsArray.shift();
  text(floor(Math.min(...fpsArray)), 10, 20);
  text(frameCount, 10, 40);
  pop();
}

function range(min, max, step = 1) {
  const a = [];
  for (let i = min; i < max; i += step) {
    a.push(i);
  }
  return a;
}

function generateParticles(count = 100) {
  const haystacks = [];

  // triangle
  haystacks[0] = {
    x: 640 + Math.sin(Math.PI * 0) * 300,
    y: 420 - Math.cos(Math.PI * 0) * 300,
  };
  haystacks[1] = {
    x: 640 + Math.sin(Math.PI * 0.66) * 300,
    y: 420 - Math.cos(Math.PI * 0.66) * 300,
  };
  haystacks[2] = {
    x: 640 + Math.sin(Math.PI * 1.33) * 300,
    y: 420 - Math.cos(Math.PI * 1.33) * 300,
  };

  const donkey = { ...haystacks[0] };

  const particles = [];

  for (let i in range(0, count)) {
    let haystackIndex = Math.floor(Math.random() * haystacks.length);
    donkey.x += (haystacks[haystackIndex].x - donkey.x) * 0.5;
    donkey.y += (haystacks[haystackIndex].y - donkey.y) * 0.5;
    //if (donkey.x > 500) continue;
    particles.push({
      x: donkey.x + random(-0.01, 0.01),
      y: donkey.y + random(-0.01, 0.01),
      dX: random(-0.1, 0.1),
      dY: random(-0.1, 0.1),
    });
  }

  return particles;
}

function saveFrame(name, frameNumber, extension, maxFrame) {
  // don't save frames once we reach the max
  if (maxFrame && frameNumber > maxFrame) {
    return;
  }

  if (!extension) {
    extension = "png";
  }
  // remove the decimal part (just in case)
  frameNumber = floor(frameNumber);
  // zero-pad the number (e.g. 13 -> 0013);
  var paddedNumber = ("0000" + frameNumber).substr(-4, 4);

  save(name + "_" + paddedNumber + "." + extension);
}
