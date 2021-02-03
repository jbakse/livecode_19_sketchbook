// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let fsin;
let sin1;
let sin2;

// so i couldn't find a way to set the prototype on a function object properly. You can do it with setPrototypeOf but warnings abound about performance, etc. There does't seem to be a way to set the prototype at creation time, like you can for an object object.

// i think the wrapping is a little much here, maybe there is a way to use a decorator pattern to reduce this. You would wrap the something like Math.sin, and decorate it.

// could also make an object that holds and mutates the function and gives it back when you want

// should look at audio api for this
// should also look at functional programming patterns, curries, etc.

// scale scale amplitude;
// shift shift phase;
// zoom scale frequency;
// add sum two signals;

function setup() {
  createCanvas(512, 256);

  sin1 = F(sin).scale(10).shift(PI).zoom(10);
  sin2 = F(sin).scale(2).zoom(0.5);
  fsin = sin1.add(sin2);
  noLoop();
}

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

  for (x = -width * 0.5; x < width * 0.5; x++) {
    vertex(x, f(x));
  }

  endShape();
}

function F(f) {
  console.log("FFF", f);
  let ff = (...args) => {
    return f(...args);
  };

  ff.scale = (scale) => {
    return F((...args) => ff(...args) * scale);
  };

  ff.shift = (shift) => {
    return F((x) => ff(x + shift));
  };

  ff.zoom = (zoom) => {
    return F((x) => ff(x / zoom));
  };

  ff.add = (f) => {
    return F((...args) => ff(...args) + f(...args));
  };

  return ff;
}

// function f(f) {
//   return (...args) => f(...args);
// }
