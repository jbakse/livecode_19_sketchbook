// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const colorFreq = 0.02;
const jitterFreq = 0.1;

// Rectangle Class
// holds the boundaries of a rectangle and has properties to split into two
class Rectangle {
  constructor(_x, _y, _w, _h) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
  }

  splitLeft(split) {
    const r1 = new Rectangle(this.x, this.y, this.w * split, this.h);
    const r2 = new Rectangle(
      this.x + this.w * split,
      this.y,
      this.w * (1 - split),
      this.h
    );
    return [r1, r2];
  }

  splitDown(split) {
    const r1 = new Rectangle(this.x, this.y, this.w, this.h * split);
    const r2 = new Rectangle(
      this.x,
      this.y + this.h * split,
      this.w,
      this.h * (1 - split)
    );
    return [r1, r2];
  }
}

const mainRect = new Rectangle(50, 50, 1920 * 0.5 - 100, 1080 * 0.5 - 100);

function setup() {
  // pixelDensity(1);
  createCanvas(1920 * 0.5, 1080 * 0.5);
  colorMode(HSB, 1);
  noFill();
  noStroke();
  frameRate(60);
  noiseDetail(1);
}

function draw() {
  background(0, 0, 1);
  randomSeed(10);
  recursiveDrawRectangles(mainRect, 16);
  // noLoop();

  // saveFrame('render', frameCount, 'jpg', 90);
}

function recursiveDrawRectangles(r, depth) {
  if (depth < 0) {
    return;
  }

  // pull some variation from noise
  let hueNoise = noise(r.x * colorFreq, r.y * colorFreq);
  hueNoise += 0.5;
  if (hueNoise > 1) hueNoise -= 1;

  let blacknessNoise = noise(r.x * colorFreq, r.y * colorFreq, 0.5);
  let saturationNoise = noise(r.x * colorFreq, r.y * colorFreq, 0.1);
  // since colorNoise and blacknessNoise are pulled from the same X and Y,
  // but not the same Z, they will have different values
  // -but- because the Zs are close (.5 apart) the z's will be somewhat related
  // Lower .5 to .1 and the values will be very close
  // Raise it to 1 and they will be pretty much unrelated.

  // I don't want to make any of the colors full black, so I map this to a better range.
  blacknessNoise = map(blacknessNoise, 0, 1, 0.5, 1.5);
  saturationNoise = map(saturationNoise, 0, 1, 1.5, 2.5);
  saturationNoise = pow(saturationNoise, 2);
  // console.log(saturationNoise);

  const offsetXNoise =
    noise(r.x * jitterFreq, r.y * jitterFreq, 1 + frameCount * 0.1) * 20 - 10;
  const offsetYNoise =
    noise(r.x * jitterFreq, r.y * jitterFreq, 2 + frameCount * 0.1) * 20 - 10;
  let rNoise = noise(r.x * jitterFreq, r.y * jitterFreq, 3);
  rNoise = map(rNoise, 0, 1, -0.05, 0.05);

  // draw rect
  fill(hueNoise, saturationNoise, blacknessNoise, 0.2);
  rotRect(r.x + offsetXNoise, r.y + offsetYNoise, r.w, r.h, rNoise);

  // subdivide
  // even chance of spliting right or left
  const rand = random();
  let r1, r2;
  if (rand < 0.5) {
    [r1, r2] = r.splitLeft(0.5 + sin((frameCount / 90) * PI) * 0.05);
  } else {
    [r1, r2] = r.splitDown(0.5 + sin(((frameCount + 30) / 90) * PI) * 0.05);
  }

  if (random() > 0.9) {
    return;
  }

  // recurse and draw again
  recursiveDrawRectangles(r1, depth - 1);
  recursiveDrawRectangles(r2, depth - 1);
}

function rotRect(x, y, w, h, r) {
  push();
  translate(x + w * 0.5, y + h * 0.5);
  rotate(r);
  rect(-w * 0.5, -h * 0.5, w, h);
  pop();
}

function keyPressed() {
  if (key === "S") {
    save("canvas.jpg");
  }

  if (key === " ") {
    draw();
  }
}

// https://jsbin.com/wimuhikahi/edit?html,js,output

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
  let paddedNumber = ("0000" + frameNumber).substr(-4, 4);

  save(`${name}_${paddedNumber}.${extension}`);
}
