// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
    createCanvas(500, 500);
}

function draw() {
    background("#334");
    noFill();
    stroke("white");
    strokeWeight(5);

    const phase1 = millis() / 1000; //sin(sin(m / 1000 * TWO_PI));
    const freq2 = map(sin(millis() / 1000 * TWO_PI * .1), -1, 1, 1, 10);
    const amp2 = map(sin(millis() / 1000 * TWO_PI * .1), -1, 1, 10, 10);
    beginShape();
    for (let i = -.1; i < 1.1; i += 1 / 100) {
        const x1a = map(i, 0, 1, 0, width);
        const y1a = map(
            cos(i * TWO_PI + phase1),
            -1,
            1,
            height * .25,
            height * .75,
        );

        const ib = i + 0.01;
        const x1b = map(ib, 0, 1, 0, width);
        const y1b = map(
            cos(ib * TWO_PI + phase1),
            -1,
            1,
            height * .25,
            height * .75,
        );

        const dx1 = x1b - x1a;
        const dy1 = y1b - y1a;

        const a = atan2(dy1, dx1);

        const x2 = 0;
        const y2 = map(cos(i * TWO_PI * freq2), -1, 1, -10, 10) * amp2;

        const [x2r, y2r] = rotatePoint(x2, y2, a);
        curveVertex(x1a + x2r, y1a + y2r);
    }
    endShape();
}

function rotatePoint(x, y, angle) {
    const x2 = x * cos(angle) - y * sin(angle);
    const y2 = x * sin(angle) + y * cos(angle);
    return [x2, y2];
}
