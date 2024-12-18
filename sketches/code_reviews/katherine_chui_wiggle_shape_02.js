// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js

/**
 * Small drawing app that draws wiggly shapes.
 *
 * original code by Katherine Chui
 * edited by Justin Bakse
 */

const CONFIG = {
    NOISE_ZOOM: 0.05,
    NOISE_LEVEL: 20,
    ANIMATION_SPEED: .02,
    STEPS: 10,
};

const pane = new Tweakpane.Pane();

pane.addInput(CONFIG, "NOISE_ZOOM", { min: 0, max: .1 });
pane.addInput(CONFIG, "NOISE_LEVEL", { min: 0, max: 100 });
pane.addInput(CONFIG, "ANIMATION_SPEED", { min: 0, max: .1 });
pane.addInput(CONFIG, "STEPS", { min: 0, max: 100 });

const COLORS = [
    "#93b399", // green 1
    "#67a072", // green 2
    "#84bc8f", // green 3
    "#f1e4d1", // tan
    "#f1734b", // orange
    "#fffffa", // white
];

const shapes = [];
let mousePoints = [];

function setup() {
    createCanvas(700, 700);
    background("#f1ece5");

    // test shape
    shapes.push({
        "points": [
            [100, 100],
            [200, 100],
            [200, 200],
            [100, 200],
        ],
        "color": random(COLORS),
    });
}

//create the shape
function mouseClicked() {
    mousePoints.push([mouseX, mouseY]);
}

//save the shape
function keyPressed() {
    shapes.push({ "points": mousePoints, "color": random(COLORS) });
    mousePoints = [];
}

function draw() {
    background("#f1ece5");

    // draw the completed shapes
    for (const shape of shapes) {
        drawShape(shape);
    }

    // draw the current shape
    if (mousePoints.length > 0) {
        push();
        noFill();
        stroke("black");
        beginShape();
        for (p of mousePoints) {
            vertex(p[0], p[1]);
        }
        vertex(mouseX, mouseY);

        endShape();
        pop();
    }
}

function drawShape(shape) {
    const expandedPoints = subdividePoints(shape.points, CONFIG.STEPS);

    push();
    fill(shape.color);
    stroke("black");
    beginShape();

    // loop through the expandedPoints, noise them, and add them to shape
    for (const p of expandedPoints) {
        const x = p[0];
        const y = p[1];

        const n = noise(
            x * CONFIG.NOISE_ZOOM,
            y * CONFIG.NOISE_ZOOM,
            frameCount * CONFIG.ANIMATION_SPEED,
        ) * CONFIG.NOISE_LEVEL;

        vertex(x + n, y + n);

        // draw an ellipse to help with debugging
        ellipse(x + n, y + n, 5, 5);
    }
    endShape(CLOSE);
    pop();
}

// add *steps* points between each pair of points
// note: this creates high density between near points
function subdividePoints(points, steps = 10) {
    const newPoints = [];

    // loop through each pair of points
    // the last pair is the last and first point
    for (let i = 0; i < points.length; i++) {
        const currPoint = points[i];
        const nextPoint = points[(i + 1) % points.length]; // loop at end

        // walk the line from currPoint to nextPoint
        // adding points to newPoints along the way
        // the first point generated by this loop will be in the same
        // position as currPoint, the last will be shy of nextPoint
        const stepSize = 1 / (steps + 1);
        for (let position = 0; position < 1; position += stepSize) {
            const x = lerp(currPoint[0], nextPoint[0], position);
            const y = lerp(currPoint[1], nextPoint[1], position);
            newPoints.push([x, y]);
        }
    }

    return newPoints;
}

// further ideas:
// change point from [x, y] to { x, y }
// make subdivide points choose steps to achieve uniform density
// create function to add noise to points before drawing
// get separate noise for x and y so displacement is 2d (not always diagonal)
// push,noiseDetail, pop
// center noise
// COPY mousePoints into the new shape
