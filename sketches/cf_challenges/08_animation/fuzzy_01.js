// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

const pane = new Tweakpane();
const params = {
  frame_rate: 0,
};

function setup() {
  createCanvas(512, 512);
  frameRate(60);
  pane.addMonitor(params, "frame_rate");
  pane.addMonitor(params, "frame_rate", {
    view: "graph",
    min: 0,
    max: 60,
  });
}

function draw() {
  background("gray");

  stroke("white");
  noFill();
  line(64, 256, 448, 256);

  noStroke();
  fill("black");

  const a = map(frameCount, 0, 60, 0, PI);
  let jump = sin(a) * 100;
  const y = 256 - jump;

  fill(0, 0, 0, 5);
  fuzzy_ellipse(256, y, 50, 50, 150);

  params.frame_rate = frameRate();
}

function fuzzy_ellipse(x, y, w, h, fuzz = 100) {
  for (let i = 0; i < 100; i++) {
    const xx = random(-fuzz, fuzz);
    const yy = random(-fuzz, fuzz);
    if (dist(0, 0, xx, yy) > fuzz) continue;
    ellipse(x + xx, y + yy, w, h);
  }
}

// eslint-disable-next-line
function fuzzy_ellipse_2(x, y, w, h, fuzz = 100) {
  for (let i = 0; i < 100; i++) {
    const a = random(2 * PI);
    const d = sqrt(random()) * fuzz;
    ellipse(
      //
      x + sin(a) * d,
      y + cos(a) * d,
      w,
      h
    );
  }
}

// http://www.anderswallin.net/2009/05/uniform-random-points-in-a-circle-using-polar-coordinates/

// Rather than draw a single ellipse, fuzz_ellipse draws many ellipses
// with random offsets. When coupled with a transparent fill it creates a
// "fuzzy" edge;

// Take some time to study this code carefully.
// Try to build an understanding of every line.

// What does `if (dist(0, 0, xx, yy) > fuzz) continue;` do?
// How many ellipses are drawn on each call of fuzzy_ellipse?

// Drawing a lot of transparent ellipses can be processor intensive. What framerate
// do you get on your computer?

// Increase the the loop count from 100 to 1000.
// How does that impact the drawing?
// How does that impact the framerate?

// Increase the the loop count—again—from 1000 to 10000.
// How does that impact the drawing?
// How does that impact the framerate?

// Export 60 frames of this animation and turn them into a 30 fps video.
// How long (in seconds) did it take to render 60 frames?
// How long (in seconds) is your resulting video?
// Does it matter what the frameRate() is set to in setup?

// What happens if you turn down the fill alpha value to 3, 2, and 1? Why?

// Challenging:
// fuzzy_ellipse_2 is a drop-in replacement for fuzzy_ellipse.
// switch the call to fuzzy_ellipse to a call for fuzzy_ellipse_2.
// do the functions produce the same outcome?
// do the functions produce the exact same outcome?
// is one more performant than then the other?
// study the code for fuzzy ellipse 2. how does this function approach the problem differently?
// which is better `fuzzy_ellipse` or `fuzzy_ellipse_2`?
