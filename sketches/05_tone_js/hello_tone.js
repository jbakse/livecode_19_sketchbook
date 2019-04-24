// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js

/* global Tone */

//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C4", "8n");
