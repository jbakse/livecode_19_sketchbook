// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.5/dat.gui.js

console.log("hi!");

let settings = {
  spacing: 10,
  noise_resolution: 0.002,
  noise2_resolution: 0.004,
  scroll_speed: 0.1,
  quick: true,
  export: false,
};

let noise_scroll = 0;
let noise_scroll2 = 0;
let frameNumber = 0;

window.setup = function() {
  console.log("i'm setup!");
  createCanvas(1920 * 0.5, 1080 * 0.5);
  frameRate(30);
};

window.draw = function() {
  background(150, 150, 150);

  for (let y = -100; y < height + 100; y += settings.spacing) {
    for (let x = -100; x < width + 100; x += settings.spacing) {
      let nx = x + betterNoise(x, y, 0) * settings.spacing;
      let ny = y + betterNoise(x, y, 1) * settings.spacing;

      let angle =
        betterNoise(nx, ny + noise_scroll, 4, settings.noise_resolution) *
        PI *
        2;
      angle +=
        betterNoise(nx + noise_scroll2, ny, 5, settings.noise2_resolution) *
        (PI * 2);

      noise_scroll += settings.noise_resolution * settings.scroll_speed;
      noise_scroll2 += settings.noise2_resolution * settings.scroll_speed;
      let cut = (0.5 + betterNoise(x, y, 10, 0.002)) * frameCount * 1.25;

      let distance = Math.max(50 - cut, 0);
      let endX = nx + sin(angle) * distance;
      let endY = ny + cos(angle) * distance;

      if (settings.quick) {
        quickLine(nx, ny, endX, endY, map(angle, -PI, PI, 200, 255));
      } else {
        shadowLine(nx, ny, endX, endY, map(angle, -PI, PI, 255, 255));
      }
    }
  }

  if (settings.export) {
    saveFrame("export", frameNumber++, "png", 150);
  }
};

function quickLine(x, y, x2, y2, color = 255) {
  stroke(color);
  strokeWeight(1);
  line(x, y, x2, y2);
}

function shadowLine(x, y, x2, y2, color = 255) {
  let len = dist(x, y, x2, y2);
  stroke(0, 20);
  strokeWeight(Math.min(5, len) + 4);
  line(x, y, x2, y2);
  strokeWeight(Math.min(5, len) + 2);
  line(x, y, x2, y2);

  stroke(color);
  strokeWeight(Math.min(5, len));
  line(x, y, x2, y2);
}

function betterNoise(x, y, z, s = 1) {
  noiseDetail(4, 0.5);
  return noise(x * s, y * s, z * s) - 0.47;
}

/*global dat*/
var gui = new dat.GUI();
gui.add(settings, "spacing", 5, 20);
gui.add(settings, "noise_resolution", 0.0005, 0.005);
gui.add(settings, "noise2_resolution", 0.0005, 0.005);
gui.add(settings, "scroll_speed", 0.01, 1);
gui.add(settings, "quick");
gui.add(settings, "export");

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
