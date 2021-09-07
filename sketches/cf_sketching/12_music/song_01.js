// require https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.17/Tone.js
// require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js

/* global Tone _*/

// First, create the synth.
const synth = new Tone.Synth().toDestination();
const harmony_synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
harmony_synth.volume.value = -3;

Tone.Transport.bpm.value = 200;

window.onmousedown = () => {
  const song = generateSong();
  playSong(song);
};

const cmajor = ["C3", "D3", "E3", "F3", "G3", "A3", "B3"];
// const cminor = ['C3', 'D3', 'Eb3', 'F3', 'G3', 'Ab3', 'B3'];

const notes = cmajor;

function generateSong() {
  // generate some measures
  const a = generateMeasure(randomInt(0, 7));
  const b = generateMeasure(randomInt(0, 7));
  const c = generateMeasure(randomInt(0, 7));

  const a2 = _.cloneDeep(a);

  // last note should be the tonic
  c.melody[c.melody.length - 1][0] = notes[0];

  const tonic_chord = [notes[0], notes[2], notes[5]]; // c e g in c
  const subdominant_chord = [notes[3], notes[5], notes[0]]; // f a c in c
  const dominant_chord = [notes[4], notes[6], notes[1]]; // g in c

  tonic_chord[0] = Tone.Frequency(tonic_chord[0]).transpose(-12);
  tonic_chord[1] = Tone.Frequency(tonic_chord[1]).transpose(-12);
  tonic_chord[2] = Tone.Frequency(tonic_chord[2]).transpose(-12);
  subdominant_chord[0] = Tone.Frequency(subdominant_chord[0]).transpose(-12);
  subdominant_chord[1] = Tone.Frequency(subdominant_chord[1]).transpose(-12);
  subdominant_chord[2] = Tone.Frequency(subdominant_chord[2]).transpose(-12);
  dominant_chord[0] = Tone.Frequency(dominant_chord[0]).transpose(-12);
  dominant_chord[1] = Tone.Frequency(dominant_chord[1]).transpose(-12);
  dominant_chord[2] = Tone.Frequency(dominant_chord[2]).transpose(-12);

  a.harmony = tonic_chord;
  b.harmony = subdominant_chord;
  a2.harmony = dominant_chord;
  c.harmony = tonic_chord;

  // arrange the measures and return
  return [a, b, a2, c];
}

function generateMeasure(degree) {
  const measure = {};
  measure.melody = [];

  let timeLeft = Tone.Time("1m");

  while (timeLeft.toSeconds() > 0) {
    // choose note
    const change = sample([-1, -1, -1, 1, 1, -2, 2, -3]);
    degree = constrain(degree + change, 0, 6);
    const note = notes[degree];

    // choose length
    let length = sample(["8n", "4n", "4n", "2n"]);

    length = Tone.Time(length);

    if (length.toMilliseconds() > timeLeft.toMilliseconds()) {
      length = timeLeft;
    }

    // keep track of time
    timeLeft = Tone.Time(timeLeft - length);

    // add the note to the melody
    measure.melody.push([note, length]);
  }

  return measure;
}

function playSong(song) {
  let t = Tone.now();
  for (const measure of song) {
    playMeasure(measure, t);
    t += Tone.Time("1m");
  }
}

function playMeasure(measure, _t) {
  let t = _t;
  for (const note of measure.melody) {
    if (note[0] !== "rest") {
      // synth.triggerAttackRelease(note[0], note[1]), t);
      synth.triggerAttackRelease(note[0], Tone.Time(note[1]), t);
    }
    t += Tone.Time(note[1]);
  }

  for (const pitch of measure.harmony) {
    harmony_synth.triggerAttackRelease(pitch, Tone.Time("1m"), _t);
  }
}

console.log("click for music!");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function sample(data) {
  const index = Math.floor(Math.random() * data.length);

  return data[index];
}

// eslint-disable-next-line
function constrain(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
