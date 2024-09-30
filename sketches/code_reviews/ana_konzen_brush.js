// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js

/**
 * Small drawing app that draws animated, textured brush strokes.
 *
 * code by Ana Konzen
 * edits by Justin Bakse
 */

const LAYERS_PER_DROP = 2;
const palette = [
    "#eab69f",
    "#e5987f",
    "#e07a5f",
    "#8f5d5d",
    "#3d405b",
    "#5f797b",
    "#81b29a",
    "#babf95",
    "#f2cc8f",
    "#b86c5e",
];

// drops holds the particles that make up the drawing
let drops = [];
let currentColor;

function setup() {
    createCanvas(400, 400);
}

function draw() {
    /// update state

    // add new drops while the user drags
    if (mouseIsPressed) {
        drops.push(new Drop(mouseX, mouseY));
    }

    for (const drop of drops) {
        drop.update();
    }

    // remove end-of-life drops
    drops = drops.filter((drop) => drop.isAlive());

    /// draw

    noStroke();
    background("#f5f5f5");

    for (const drop of drops) {
        drop.show();
    }
}

function mousePressed() {
    currentColor = color(random(palette));
}

/**
 * The drops make up the drawing. Each drop has multiple layers.
 * Each layer is a scribbley vector drawing (kind of like drawing
 * a star by hand, but with random angles and radii).
 * Each layer's color is adjusted a bit from the current color to add
 * richness.
 */

class Drop {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.age = 0;
        this.scale = random(0.5, 1);
        this.rate = random(0.04, 0.05);

        this.layers = [];
        for (let i = 0; i < LAYERS_PER_DROP; i++) {
            this.layers.push({
                color: jitteredColor(currentColor, 5, 5),
                // note: Array.from might be a bit overly clever maybe a loop would be clearer, esp for newer js coders
                // note: where you had two -corresponding- arrays, i made one array of objects with two properties
                points: Array.from(
                    { length: 12 },
                    () => (
                        {
                            radius: randomGaussian(5, .5),
                            angle: random(PI * 2),
                        }
                    ),
                ),
                // note: i removed angle, because i don't think it
                // had any visible effect, since the the layers
                // don't really have an orientation anyway
            });
        }
    }

    update() {
        this.age++;
        if (this.age < 70) {
            // note: removed the increase/decrease functions
            // they were only called from here, and they were very short
            // inlining looks better to me
            this.scale += this.rate;
        } else if (this.age > 300) {
            this.scale -= this.rate;
        }
    }

    isAlive() {
        return this.scale > 0;
    }

    show() {
        push();
        // position the Drop
        translate(this.x, this.y);
        scale(this.scale);

        // draw the layers
        for (const layer of this.layers) {
            fill(layer.color);
            beginShape();
            for (const p of layer.points) {
                let x = cos(p.angle) * p.radius;
                let y = sin(p.angle) * p.radius;
                vertex(x, y);
            }
            endShape();
        }
        pop();
    }
}

// final note:
// right now your layers do two things.
// 1 they make the drops "denser"
// 2 they layers are slightly different colors, but you +-5 rgb is really subtle

// you could probably get away with a single layer of higher opacity
// it wouldn't look exactly the same, but it would be simpler.
// if you then generated 5 drops at a time, it would end up looking the same, but get there a different way.

// this would set you up for the thing you mentioned you wanted to deal with: the gaps between the drops when you draw quickly.

// you could look at the previous mouse position and the current mouse position and draw drops between them.

/**
 * Returns a color based on base.
 * Offsets the RGB randomly by amount.
 * Sets the alpha to alpha.
 */
// note: this function does two things, jitters the hue, and sets the alpha
// functions should do one thing, but sometimes you bend the rules.
function jitteredColor(base, amount, newAlpha) {
    return color(
        randomGaussian(red(base), amount),
        randomGaussian(green(base), amount),
        randomGaussian(blue(base), amount),
        newAlpha ?? alpha(base),
    );
}
