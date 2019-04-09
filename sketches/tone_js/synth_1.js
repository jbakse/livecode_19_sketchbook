// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js

/* global Tone */

// create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth({
  oscillator: {
    // sine, square, triangle, sawtooth
    type: "triangle",
  },
  envelope: {
    attack: 0.1,
    decay: 1,
    sustain: 0.4,
    release: 2,
  },
}).toMaster();

// launch jingle
synth.triggerAttackRelease("C4", "16n", "0:0:4");
synth.triggerAttackRelease("D4", "16n", "0:0:5");
synth.triggerAttackRelease("D#4", "16n", "0:0:6");

window.onmousedown = (e) => {
  let note = map(e.clientX, 0, window.innerWidth, 20, 80);
  let freq = Tone.Frequency(note, "midi");
  synth.triggerAttack(freq);
};

window.onmouseup = (e) => {
  synth.triggerRelease();
};

function map(value, min1, max1, min2, max2) {
  let n = (value - min1) / (max1 - min1);
  return n * (max2 - min2) + min2;
}
