// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js

// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/addons/p5.sound.js

/* exported setup draw preload */
/* globals loadSound, sampleRate */
/* globals Tweakpane */
/* globals sketch_directory */

// todo
// trebble boost param?
// how to capture input for this?
// color well controlls
// gutter size
// level stroke size
// range box: none, outline, solid, just bottom and top
// range box: stroke size
// draw arrows at low and high piano key
// add preset reset

const params = {
  barCount: 128,
  fftBuckets: 2048,
  smoothing: 0.8,
  backColor: "#000000ff",
  lineColor: "#ffffffff",
  boxColor: "#ffffff99",
  shrink: 5,
  highBoost: 0.0,
};

const baseParams = Object.assign({}, params);

const pane = new Tweakpane();
pane.addButton({ title: "Play" }).on("click", () => {
  song.play();
});
pane.addSeparator();
pane.addInput(params, "barCount", { min: 0, max: params.fftBuckets });
pane.addInput(params, "smoothing", { min: 0, max: 1 });
pane.addInput(params, "shrink", { min: 0, max: 10 });
pane.addInput(params, "highBoost", { min: 0, max: 1 });
pane.addInput(params, "backColor");
pane.addInput(params, "lineColor");
pane.addInput(params, "boxColor");

pane.addSeparator();
pane.addButton({ title: "Save" }).on("click", saveParams);
pane.addButton({ title: "Reset" }).on("click", resetParams);
// pane.on("change", saveParams);

// import presets from local storage
function loadParams() {
  const p = localStorage.getItem("params");
  console.log("import", { p });
  if (p) {
    console.log("Importaing Presets");
    pane.importPreset(JSON.parse(p));
  }
}
loadParams();

// save presets to local storage
function saveParams() {
  const p = pane.exportPreset();
  localStorage.setItem("params", JSON.stringify(p));
}

function resetParams() {
  Object.assign(params, baseParams);
}

let song;
let fft;
const buckets = [];

function preload() {
  console.log(loadSound);
  song = loadSound(sketch_directory + "music/mozart_01_30.mp3");
  // song = loadSound(sketch_directory + "music/white_noise_01.mp3");
}

function setup() {
  createCanvas(1920 * 0.5, 1080 * 0.5);

  song.play();
  fft = new p5.FFT(0, params.fftBuckets);

  times(params.fftBuckets, (i) => {
    buckets.push({
      i,
      energy: 0,
      max: 0,
      min: 0,
      smooth: 0,
    });
  });
  // console.log(`sampleRate: ${sampleRate()}`);
  // for (let i = 0; i < params.fftBuckets; i++) {
  //   console.log(`${i} => ${indexToFreq(i, sampleRate(), params.fftBuckets)}`);
  // }
}

function draw() {
  const spectrum = fft.analyze();
  for (const bucket of buckets) {
    const boost = bucket.i * params.highBoost * 0.01;
    bucket.energy = spectrum[bucket.i] * (1 + boost);
    bucket.smooth = lerp(bucket.smooth, bucket.energy, 1 - params.smoothing);
    bucket.min += params.shrink;
    bucket.max -= params.shrink;
    bucket.min = min(bucket.min, bucket.smooth);
    bucket.max = max(bucket.max, bucket.smooth);
  }

  background(params.backColor);

  for (let i = 0; i < params.barCount; i++) {
    const x = map(i, 0, params.barCount, 0, width);
    const w = width / params.barCount;
    const y = height - 10;

    const smooth = map(buckets[i].smooth, 0, 255, 0, y);
    const min = map(buckets[i].min, 0, 255, 0, y);
    const max = map(buckets[i].max, 0, 255, 0, y);
    // h *= i * 0.1;
    // rect(x, y, w - 1, -h);

    push();
    {
      rectMode(CORNERS);
      noFill();
      stroke(params.boxColor);
      rect(x, y - min, x + w - 2, y - max);
      stroke(params.lineColor);
      line(x, y - smooth, x + w - 2, y - smooth);
    }
    pop();
  }
}

// frequency to index
// https://github.com/processing/p5.js-sound/blob/8fe9ab7afd4d14cf31821015683539fb1a64161b/src/fft.js

function freqToIndex(freq, sampleRate, bucketCount) {
  const nyquist = sampleRate / 2;
  return (freq / nyquist) * bucketCount;
}

function indexToFreq(index, sampleRate, bucketCount) {
  const nyquist = sampleRate / 2;
  return (index / bucketCount) * nyquist;
}

// piano frequencies range from 27.5 A0 to 4186.01 C8
// at 44100, were looking at the first 48/256 ~20 of the spectrum for musical note base tones

function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
