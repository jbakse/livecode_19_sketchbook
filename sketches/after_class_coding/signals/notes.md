# Things to do with periodic functions.

Make an LED blink. Make an LED pulse. Make an LED flicker.

Play a beat. Play a tone. Modulate tones and beats.

Make a sprite bounce. Make a sprite wiggle. Make a sprite spin.

Make an endless landscape. Make a procedural animation.

# Some perodic (and pseudo-periodic) functions.

Sine Waves

- `sin(x)`
- `cos(x)`

Sawtooth Waves

- `fract(x)`
- `x % 4` for positive numbers

Noise

- `noise(x)`

Triangle

- `abs(fract(x - 0.5) - 0.5) * 2`

Square / Pulse

- `fract(x) < .5`

![waveshapes](https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Waveforms.svg/800px-Waveforms.svg.png)

# Period, Frequency, Amplitude, Phase Shift, Vertical Shift

**Period**
The width of the repeating wave. `1 / freqency`

**Frequency**
The number of times the wave repeats per unit. `1 / period`

**Amplitude**
The height of the wave (from center)

**Phase Shift**
The distance the wave is offset horizontally.

**Vertical Shift**
The distance the wave is offset vertically.

![wave terms](https://www.mathsisfun.com/algebra/images/a-sin-bxcd.svg)
[Math is Fun](https://www.mathsisfun.com/algebra/amplitude-period-frequency-phase-shift.html)

# Manipulating the Wave

Mirror
: abs()

Step
: round(), floor(), ceil(), int()

Invert
: 1 - x

Negate
: 0 - x

Bend
: pow() (^1, ^.5, ^2)

Constrain
: min(), max(), constrain()

Compare
: <, <=, >, >=, ===
: step(), smoothStep() // in glsl

Combine
: min(A, B), max(A, B), lerp(A, B, t)

[Book of Shaders: Shaping Functions](https://thebookofshaders.com/05/)
[IQ: Useful Little Functions](https://www.iquilezles.org/www/articles/functions/functions.htm)

# Domain Warping

xxx(abs(x)) // horizontal mirror
sin(constrain(x, 0, TWO_PI)) // one wave

# Doing Something!

Inputs:

- frameCount, millis()
- mouseX, mouseY
- x, y

Outputs:

- color, alpha
- volume, pitch
- x, y
- width, height

# The Best Range

The best range is [0, 1), _The unit interval, more precisely a half-open unit interval._
The second best range is [-1, 1]
Also great is [0, 1] _The closed unit interval._

# Stickers

```javascript
mod = (x, m) => ((x % m) + m) % m;
tri = (x) => abs(fract(x - 0.5) - 0.5) * 2;
squareWave = (x, d) => (fract(x) < d ? 0 : 1);
step = (e, x) -> x < e ? 0 : 1;

smoothStep = (e0, e1, x) -> {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

c = sin(x), sqrt(c * c + 0.01) // smooth hills
```

# Javascript % Operator

The JavaScript % operator is a _Remainder Operator_ not a _Modulo Operator_.

[MDN: Remainder (%)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)

[Stackoverflow: JavaScript % w/ Negatives](https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers)

"Javascript sometimes feels like a very cruel joke - dukeofgaming"
