// # synth_1.js
// This example shows how to create a `Tone.Synth` and play notes on it.

// ## Include Libs

// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js

// ## Configure Tools
/* global Tone */

// First, create the synth.
const synth = new Tone.Synth({
  oscillator: {
    type: "triangle", // sine, square, triangle, sawtooth
  },
  envelope: {
    attack: 0.1,
    decay: 1,
    sustain: 0.4,
    release: 2,
  },
});

// The synth needs to be connected to the master output, or you won't hear anything.
synth.toMaster();

// The next bit is commented out. Comment it in to modulate the synth frequency.
/*
var warbler = new Tone.Oscillator(20, "sine");
warbler.start();
warbler.chain(new Tone.Multiply(20), synth.oscillator.frequency);
*/

// Play a little jingle when the script starts
synth.triggerAttackRelease("C4", "16n", "0:0:4");
synth.triggerAttackRelease("D4", "16n", "0:0:5");
synth.triggerAttackRelease("D#4", "16n", "0:0:6");

// ![ADSR](/sketches/tone_js/adsr.png)
// Start playing an interactive note on mouse press.
window.onmousedown = (e) => {
  let note = map(e.clientX, 0, window.innerWidth, 20, 80);
  let freq = Tone.Frequency(note, "midi");
  synth.triggerAttack(freq);
};

// Stop on mouse release.
window.onmouseup = (e) => {
  synth.triggerRelease();
};

// ## Utilities

// Good old map.
function map(value, min1, max1, min2, max2) {
  let n = (value - min1) / (max1 - min1);
  return n * (max2 - min2) + min2;
}
