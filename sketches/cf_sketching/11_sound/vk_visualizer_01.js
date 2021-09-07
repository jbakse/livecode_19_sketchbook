// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js

// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/addons/p5.sound.js

/* exported setup draw preload */
/* globals loadSound */
/* globals Tweakpane */
/* globals sketch_directory */

// const flags = {};
// let searchParams = new URLSearchParams(document.location.search.substring(1));
// flags.showConfig = searchParams.get("showConfig");

const defaultParams = {
  gain: 1.0,
  highBoost: 0.0,
  barCount: 128,
  bucketCount: 2048,
  smoothing: 0.8,
  boxShrink: 5,
  barGutter: 2,
  lineWeight: 1,
  lineColor: "#ffffffff",
  boxLineColor: "#ffffff99",
  boxFillColor: "#ffffff00",
  backColor: "#000000ff",
  frameRate: "",
};

const params = Object.assign({}, defaultParams);

const pane = new Tweakpane();

let testSong; // p5.SoundFile
let fft; // p5.FFT
let audioInput; // p5.AudioIn

const buckets = []; // array of bucket data

//////////////////////////////////////////////////
// Commands

// import presets from local storage
function loadParams() {
  const p = localStorage.getItem("params");
  if (p) {
    console.log("Importing Settings");
    console.log(JSON.parse(p));
    pane.importPreset(JSON.parse(p));
  }
}

// save presets to local storage
function saveParams(e) {
  const p = pane.exportPreset();
  localStorage.setItem("params", JSON.stringify(p));

  // kinda hacky, but i couldn't think of anything simpler + better
  const msg = pane.addFolder({
    disabled: true,
    title: "Saved to Local Storage",
  });
  setTimeout(() => msg.dispose(), 1000);

  // alert("Settings saved to localStorage.");
}

// reset params to hardcoded defaults
function resetParams() {
  Object.assign(params, defaultParams);
  pane.importPreset(params);
}

// connect fft analyzer to test song
function useSong() {
  if (!testSong.isPlaying()) {
    testSong.play();
  }
  testSong.connect();
  audioInput.disconnect();
  fft.setInput(testSong);
}

// connect fft analyzer to system audio input
function useInput() {
  testSong.stop();
  testSong.disconnect();
  fft.setInput(audioInput);
}

//////////////////////////////////////////////////
// Preload

function preload() {
  testSong = loadSound(sketch_directory + "music/mozart_01_30.mp3");
}

//////////////////////////////////////////////////
// Setup

function configurePane() {
  pane.addButton({ title: "Use Test Song" }).on("click", useSong);
  pane.addButton({ title: "Use Audio In" }).on("click", useInput);

  pane.addSeparator();

  pane.addMonitor(params, "frameRate");

  pane.addSeparator();

  pane.addInput(params, "gain", { min: 0, max: 2 });
  pane.addInput(params, "highBoost", { min: 0, max: 1 });
  pane.addInput(params, "smoothing", { min: 0, max: 1 });

  pane.addSeparator();

  pane.addInput(params, "barCount", { min: 0, max: params.bucketCount });
  pane.addInput(params, "barGutter", { min: 0, max: 10 });
  pane.addInput(params, "boxShrink", { min: 0, max: 10 });

  pane.addSeparator();

  pane.addInput(params, "lineWeight", { min: 0, max: 100 });
  pane.addInput(params, "lineColor");
  pane.addInput(params, "boxLineColor");
  pane.addInput(params, "boxFillColor");
  pane.addInput(params, "backColor");

  pane.addSeparator();

  pane.addButton({ title: "Save Settings" }).on("click", saveParams);
  pane.addButton({ title: "Reset Settings" }).on("click", resetParams);

  loadParams();
  // pane.hidden = true;
}

function setup() {
  configurePane();
  createCanvas(1920 * 0.5, 1080 * 0.5);

  // connect to system audio, configure input via browser
  audioInput = new p5.AudioIn();
  audioInput.start();

  // create fft analyzer
  fft = new p5.FFT(0, params.bucketCount);

  // initialize bucket data
  times(params.bucketCount, (i) => {
    buckets.push({
      i, // index
      energy: 0, // current energy w/o smoothing
      smooth: 0, // current energy w/ smoothing
      max: 0, // recent max smooth (decays w/ boxShrink)
      min: 0, // recent min smooth (decays w/ boxShrink)
    });
  });

  // config p5 state
  rectMode(CORNERS);

  // start
  useInput();
}

function draw() {
  params.frameRate = Math.floor(frameRate());
  // analyze current audio
  const spectrum = fft.analyze();

  // update our bucket data
  for (const bucket of buckets) {
    // apply adjustments
    const boost = bucket.i * params.highBoost * 0.01;
    bucket.energy = spectrum[bucket.i] * (1 + boost) * params.gain;

    // calculate smoothed value
    bucket.smooth = lerp(bucket.smooth, bucket.energy, 1 - params.smoothing);

    // keep track of max and min with decay
    bucket.min += params.boxShrink;
    bucket.max -= params.boxShrink;
    bucket.min = min(bucket.min, bucket.smooth);
    bucket.max = max(bucket.max, bucket.smooth);
  }

  // draw
  background(params.backColor);

  for (let i = 0; i < params.barCount; i++) {
    // calculate track position
    const track_x = map(i, 0, params.barCount, 0, width);
    const track_w = Math.max(1, width / params.barCount - params.barGutter);
    const track_y = height - 10;

    // calculate where the line, box top, and box bottom go
    const smooth = map(buckets[i].smooth, 0, 255, 0, track_y);
    const min = map(buckets[i].min, 0, 255, 0, track_y);
    const max = map(buckets[i].max, 0, 255, 0, track_y);

    push();
    {
      // draw box
      fill(params.boxFillColor);
      stroke(params.boxLineColor);
      rect(track_x, track_y - min, track_x + track_w, track_y - max);

      // draw line
      stroke(params.lineColor);
      strokeWeight(params.lineWeight);
      strokeCap(SQUARE);
      line(track_x, track_y - smooth, track_x + track_w, track_y - smooth);
    }
    pop();
  }
}

function keyPressed() {
  pane.hidden = !pane.hidden;
}

// frequency to index
// https://github.com/processing/p5.js-sound/blob/8fe9ab7afd4d14cf31821015683539fb1a64161b/src/fft.js

// function freqToIndex(freq, sampleRate, bucketCount) {
//   const nyquist = sampleRate / 2;
//   return (freq / nyquist) * bucketCount;
// }

// function indexToFreq(index, sampleRate, bucketCount) {
//   const nyquist = sampleRate / 2;
//   return (index / bucketCount) * nyquist;
// }

// piano frequencies range from 27.5 A0 to 4186.01 C8
// at 44100, were looking at the first 48/256 ~20 of the spectrum for musical note base tones

/**
 * times
 * run the function `f` `t` times, return results as array
 */
function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

// Notes:
// Feature Ideas
// [x] trebble boost param
// [x] color well controls
// [x] gutter size
// [x] level stroke size
// [x] add preset reset
// [] draw arrows at low and high piano key
// [x] show/hide options
// [] scale canvas for full screen
