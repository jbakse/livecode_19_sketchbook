// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
    createCanvas(500, 500);
    colorMode(HSB, 1);
    noLoop();
}

function draw() {
    const hue = random();
    background(hue, .7, .3);

    const points = hexPoints(width, height, 15);
    randomDisplace(points, 6);

    // drawConnections(points);
    // drawPoints(points);

    const visited = [];
    for (let i = 0; i < 100; i++) {
        const walk = walkPoints(points, random(points), 100, visited);
        visited.push(...walk);
        // draw the walk
        // pick a complimentary-ish color
        stroke(random(hue + .4, hue + .6) % 1, 1, 1);
        strokeWeight(16);
        strokeJoin(ROUND);
        noFill();
        beginShape();

        for (const p of walk) {
            console.log(p);
            vertex(p.x, p.y);
        }
        endShape();
    }
}

// a point placing tactic that arranges points in a hex grid
function hexPoints(w = width, h = height, cols = 10) {
    const points = [];
    const x_space = w / (cols - .5);
    // sqrt(3) / 2 is the ratio of the height of an equilateral triangle
    // to its side length
    const y_space = x_space * sqrt(3) / 2;
    const rows = h / y_space;

    function id(x, y) {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return -1;
        return y * cols + x;
    }

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const offset = y % 2 ? 0 : x_space / 2;
            const px = x * x_space + offset;
            const py = y * y_space;
            const newVector = createVector(px, py);

            // in addition to finding the location of the points
            // lets tag them with an id, and a list of their neighbor ids
            // number them
            newVector.id = id(x, y);

            // add list of neighbors
            neighbors = [];
            neighbors.push(id(x - 1, y)); // left
            neighbors.push(id(x + 1, y)); // right
            neighbors.push(id(x, y - 1)); // up
            neighbors.push(id(x, y + 1)); // down
            const evenRow = y % 2;
            neighbors.push(id(x + (evenRow ? -1 : 1), y - 1)); // up diag
            neighbors.push(id(x + (evenRow ? -1 : 1), y + 1)); // down diag
            neighbors = neighbors.filter((id) => id !== -1);
            newVector.neighborIds = neighbors;

            points.push(newVector);
        }
    }
    return points;
}

function randomDisplace(points, maxDisplacement) {
    for (const p of points) {
        p.x += random(-maxDisplacement, maxDisplacement);
        p.y += random(-maxDisplacement, maxDisplacement);
    }
}

// starts at current point, walks to a random neighbor, repeats steps times
// won't visit the same point twice
// won't visit points in the visited list
// returns the list of points visited
function walkPoints(points, currentPoint, steps, visited = []) {
    if (visited.includes(currentPoint)) return [];
    const walk = [currentPoint];
    for (let i = 0; i < steps; i++) {
        const nextPoint = points[random(currentPoint.neighborIds)];
        if (walk.includes(nextPoint)) continue;
        if (visited.includes(nextPoint)) continue;
        walk.push(nextPoint);
        currentPoint = nextPoint;
    }
    return walk;
}

function drawPoints(points) {
    push();
    noStroke();
    fill(.25, .75, .75);
    for (const p of points) {
        ellipse(p.x, p.y, 10, 10);
    }
    pop();
}

function drawConnections(points) {
    push();
    stroke(.25, .75, .5);
    strokeWeight(1);
    for (const p of points) {
        for (const n of p.neighborIds) {
            const neighbor = points[n];
            line(p.x, p.y, neighbor.x, neighbor.y);
        }
    }
    pop();
}
