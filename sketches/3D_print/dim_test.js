// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw preload*/
/* globals sketch_directory */

const WIDTH = 1920;
const HEIGHT = 1080;
const RESOLUTION = 0.0625; // xy res in mm
const MM = 1 / RESOLUTION;

let font;

function preload() {
  font = loadFont(`${sketch_directory}/Nunito-Black.ttf`);
}

function setup() {
  pixelDensity(1);
  createCanvas(WIDTH, HEIGHT, WEBGL);
  noSmooth();

  noStroke();
  textFont(font);
  textSize(30);
  frameRate(1);
}

const SAVE = false;

function draw() {
  const BOTTOM = frameCount <= 3;

  background(0);

  const play = floor(0.1 * MM); // this is one pixel

  // offset half the drawing
  translate(-4 * 12 * MM, -2 * 12 * MM);
  // compensate for extra right and bottom margin
  translate(2 * MM, 2 * MM);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      push();
      translate(col * 12 * MM, row * 12 * MM);
      brickWall(
        1, // 1 stud wide
        1, // 1 tall
        play,
        col, // dimming width
        BOTTOM ? [30, 60, 90, 120][row] : 255 // dimming amount
      );
      pop();
    }
  }
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      push();
      translate(col * 12 * MM, row * 12 * MM);
      fill(255);
      rect(7 * MM, 3 * MM, 6 * MM, 2 * MM);
      pop();
    }
    if (!BOTTOM) {
      fill(0);
      textAlign(RIGHT);
      text([40, 80, 120, 160][row], 8 * 12 * MM, (row * 12 + 5) * MM - 4);
    }
  }
  if (SAVE) {
    save(`dim_test_${frameCount}.png`);
  } else {
    console.log(`dim_test_${frameCount}.png`);
  }
  if (frameCount === 64) noLoop();
}

function brickWall(
  studW = 1,
  studH = 1,
  playPixels = 0,
  dimPixels = 0,
  dimLevel = 0
) {
  const outerPixelW = studW * 8 * MM;
  const outerPixelH = studH * 8 * MM;
  const innerPixelW = ceil(studW * 4.8 * MM);
  const innerPixelH = ceil(studH * 4.8 * MM);
  const innerOffsetX = 1.6 * MM;
  const innerOffsetY = 1.6 * MM;
  //   console.log({
  //     outerPixelW,
  //     outerPixelH,
  //     innerPixelW,
  //     innerPixelH,
  //     innerOffsetX,
  //     innerOffsetY,
  //   });

  noStroke();

  // draw outer dim
  fill(dimLevel);
  rect(
    0 + playPixels,
    0 + playPixels,
    outerPixelW - playPixels * 2,
    outerPixelH - playPixels * 2
  );

  // draw outer
  fill(255);
  rect(
    0 + playPixels + dimPixels,
    0 + playPixels + dimPixels,
    outerPixelW - playPixels * 2 - dimPixels * 2,
    outerPixelH - playPixels * 2 - dimPixels * 2
  );

  // draw inner dim
  fill(dimLevel);
  rect(
    innerOffsetX - dimPixels,
    innerOffsetY - dimPixels,
    innerPixelW + dimPixels * 2,
    innerPixelH + dimPixels * 2
  );

  // draw inner
  fill(0);
  rect(innerOffsetX, innerOffsetY, innerPixelW, innerPixelH);
}
