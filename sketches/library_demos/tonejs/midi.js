// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js

// First, create the synth.
const synth = new Tone.Synth({
  oscillator: {
    type: "square", // sine, square, triangle, sawtooth
  },
  envelope: {
    attack: 2,
    decay: 0.1,
    sustain: 1,
    release: 1,
  },
});

// The synth needs to be connected to the master output, or you won't hear anything.

synth.toMaster();

synth.triggerAttackRelease("C4", "16n", "0:0:4");
synth.triggerAttackRelease("D4", "16n", "0:0:5");
synth.triggerAttackRelease("D#4", "16n", "0:0:6");

let lfo = new Tone.Oscillator(20, "square");
lfo.start();
let mult = new Tone.Multiply(22);

lfo.chain(mult, synth.oscillator.frequency);

//
//
//
//
//
//
//
//
//
//
//
//

connectMidi();

function connectMidi() {
  if (!navigator.requestMIDIAccess) return;
  // pretty limited support (4/2018), works in chrome
  // update still limited to chrome (4/2019)

  navigator.requestMIDIAccess().then(
    (access) => {
      const inputs = Array.from(access.inputs.values());
      for (let input of inputs) {
        console.log(`connecting ${input.manufacturer} ${input.name}`);
        input.onmidimessage = onMIDIMessage;
      }
    },
    () => console.log("midi failure")
  );
}

function onMIDIMessage(m) {
  const command = m.data[0];
  const note = m.data[1];
  const velocity = m.data[2];
  console.log(m.data);
  console.log(Tone.Midi(note).toFrequency());

  if (command === 144) {
    console.log(Tone.Midi(note).toFrequency());
    synth.triggerAttack(Tone.Midi(note).toFrequency());
  }

  if (command === 128 || velocity === 0) {
    synth.triggerRelease();
  }

  if (command === 176 && m.data[1] === 73) {
    lfo.frequency.value = (m.data[2] / 128) * 10;
  }

  if (command === 176 && m.data[1] === 75) {
    mult.value = m.data[2];
  }
}
