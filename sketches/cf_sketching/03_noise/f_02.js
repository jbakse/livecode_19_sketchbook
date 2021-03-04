// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let fsin;

// taking another run at this without trying to have properties on functions

function setup() {
  createCanvas(512, 256);
  noLoop();

  let bigSin = f_scale(sin, 128);
  bigSin = f_zoom(bigSin, 256 / PI);

  let littleSin = f_scale(sin, 10);
  littleSin = f_zoom(littleSin, 10 / PI);

  fsin = f_add(bigSin, littleSin);
}

function f_add(f1, f2) {
  return (...args) => f1(...args) + f2(...args);
}

function f_scale(f, scale) {
  return (...args) => f(...args) * scale;
}

function f_zoom(f, zoom) {
  return (...args) => {
    args = args.map((a) => a / zoom);
    return f(...args);
  };
}

function f_shift(f, shift) {
  return (...args) => {
    args = args.map((a) => a + shift);
    return f(...args);
  };
}

// ff.shift = (shift) => {
//   return F((x) => ff(x + shift));
// };

// ff.zoom = (zoom) => {
//   return F((x) => ff(x / zoom));
// };

function draw() {
  background(200);

  // set up transform
  translate(0, 128);
  translate(256, 0);

  // draw axis
  noFill();
  stroke(50);
  strokeWeight(0.5);
  line(width * -0.5, 0, width * 0.5, 0);
  line(0, -50, 0, 50);

  // plot(sin1);
  // plot(sin2);
  plot(fsin);
}

function plot(f) {
  beginShape();

  for (x = -width * 0.5; x < width * 0.5; x += 0.5) {
    vertex(x, f(x));
  }

  endShape();
}
