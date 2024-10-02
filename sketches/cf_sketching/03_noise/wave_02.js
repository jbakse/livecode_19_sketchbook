// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/**
this started as an excercise in making the code better factored and easier to read but, then it sort of when crazy with the higher order functions, and now its extra cryptic!
*/
function setup() {
    createCanvas(500, 500);
    noFill();
    stroke("white");
    strokeWeight(5);
    noLoop();
}

function draw() {
    background("#334");

    push();
    translate(0, height * .5);

    const lwave = layer(layer(wave1, wave2), wave3);

    beginShape();
    for (let i = -.1; i < 1.1; i += 1 / 500) {
        curveVertex(...lwave(i));
    }
    endShape();
    pop();
}

function layer(f1, f2) {
    const s = slope(f1);
    return (n) => {
        const p1 = f1(n);
        const a1 = s(n);
        const p2 = rotatePoint(f2(n), a1);

        console.log("!", p1, a1, p2);

        return [p1[0] + p2[0], p1[1] + p2[1]];
    };
}

function slope(f1) {
    return (n) => {
        const h = 0.0001;
        const p1 = f1(n);
        const p2 = f1(n + h);
        const dp = [p2[0] - p1[0], p2[1] - p1[1]];
        return atan2(dp[1], dp[0]);
    };
}

function add(f1, f2) {
    return (n) => {
        const [x1, y1] = f1(n);
        const [x2, y2] = f2(n);
        return [x1 + x2, y1 + y2];
    };
}

function wave1(n) {
    return [
        map(n, 0, 1, 0, width),
        cos(n * TWO_PI) * height * .25,
    ];
}

function wave2(n) {
    return [
        0,
        cos(n * TWO_PI * 8) * 20,
    ];
}

function wave3(n) {
    return [
        0,
        cos(n * TWO_PI * 32) * 5,
    ];
}

function rotatePoint([x, y], angle) {
    const x2 = x * cos(angle) - y * sin(angle);
    const y2 = x * sin(angle) + y * cos(angle);
    return [x2, y2];
}
