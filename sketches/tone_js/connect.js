// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js

/* global Tone */

//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C4", "8n");

var osc = new Tone.Oscillator(220, "sine");
osc.start().toMaster();
osc.stop(2);

var osc2 = new Tone.Oscillator(10, "sine");
osc2.start();
osc2.chain(new Tone.Multiply(200), osc.frequency);
osc2.chain(new Tone.Multiply(200), synth.oscillator.frequency);
