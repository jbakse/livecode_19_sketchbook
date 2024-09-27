// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
    createCanvas(500, 500);
    colorMode(HSB, 1);
    noLoop();
}

function draw() {
    background(0, .3, .3);

    // a point placing strategy that arranges points in a hex grid
    const points = hexPoints(width, height, 20);

    for (const p of points) {
        noStroke();
        fill(.25, .75, .75);
        ellipse(p.x, p.y, 10, 10);

        if (random() < .1) {
            noFill();
            stroke(.25, .75, .75);
            for (const n of p.neighborIds) {
                const neighbor = points[n];
                line(p.x, p.y, neighbor.x, neighbor.y);
            }
        }
    }
}

function hexPoints(w = width, h = height, cols = 10) {
    const points = [];
    const x_space = w / cols;
    const y_space = x_space * sqrt(3) / 2;
    const rows = h / y_space;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const offset = y % 2 ? 0 : x_space / 2;
            const px = x * x_space + offset;
            const py = y * y_space;
            const newVector = createVector(px, py);

            // number them
            newVector.id = y * cols + x;

            // add list of neighbors, this is a tricky bit!

            // newVector.neighborIds = [
            //     newVector.id - 1, // left
            //     newVector.id + 1, // right
            //     newVector.id + cols, // down
            //     newVector.id - cols, // up
            //     newVector.id + cols + (y % 2 ? 1 : -1), // down left/right
            //     newVector.id - cols + (y % 2 ? 1 : -1), // up left/right
            // ].filter(
            //     // remove invalid ids
            //     (id) => id >= 0 && id < cols * rows,
            // );

            function id(x, y) {
                if (x < 0 || x >= cols || y < 0 || y >= rows) return -1;
                return y * cols + x;
            }
            newVector.neighborIds = [];

            // left
            if (x > 0) newVector.neighborIds.push(newVector.id - 1);
            // right
            if (x < cols - 1) newVector.neighborIds.push(newVector.id + 1);
            // down
            if (y < rows - 1) newVector.neighborIds.push(newVector.id + cols);
            // up
            if (y > 0) newVector.neighborIds.push(newVector.id - cols);
            // down left/right
            if (y < rows - 1) {
                if (y % 2 === 0) {
                    if (x < cols - 1) {
                        newVector.neighborIds.push(newVector.id + cols + 1);
                    }
                } else {
                    if (x > 0) {
                        newVector.neighborIds.push(newVector.id + cols - 1);
                    }
                }
            }
            // up left/right
            if (y > 0) {
                if (y % 2 === 0) {
                    if (x < cols - 1) {
                        newVector.neighborIds.push(newVector.id - cols + 1);
                    }
                } else {
                    if (x > 0) {
                        newVector.neighborIds.push(newVector.id - cols - 1);
                    }
                }
            }

            points.push(newVector);
        }
    }
    return points;
}
