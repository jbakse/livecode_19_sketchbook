// dont-require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Latest version breaks my tricks for aliased drawing!

// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.js
// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js

const WIDTH = 192 * 2;
const HEIGHT = 108 * 2;

const pane = new Tweakpane();
const params = {
    GRID_SIZE: 16,
    GAP: 1,
    BORDER: 1,
    SHUFFLE: true,
    H: .5,
    DRAW_REGIONS: false,
    DRAW_TOOLS: true,
};

let COLUMNS = WIDTH / params.GRID_SIZE;
let ROWS = HEIGHT / params.GRID_SIZE;

// set up the canvas and initialize regions
// deno-lint-ignore no-unused-vars
function setup() {
    //createCanvas(1280, 720);
    pixelDensity(1);
    noSmooth();
    const c = createCanvas(WIDTH, HEIGHT, WEBGL);
    c.style("width", "100%");
    c.style("height", "auto");
    c.style("image-rendering", "pixelated");

    colorMode(HSB, 1);
    noLoop();

    pane.addInput(params, "GRID_SIZE", {
        label: "Grid Size",
        options: {
            32: 32,
            24: 24,
            16: 16,
            12: 12,
            8: 8,
            4: 4,
            6: 6,
        },
    });
    pane.addInput(params, "GAP", {
        label: "Gap",
        min: 0,
        max: 16,
        step: 1,
    });
    pane.addInput(params, "BORDER", {
        label: "Border",
        min: 0,
        max: 16,
        step: 1,
    });
    pane.addInput(params, "SHUFFLE", {
        label: "Shuffle",
    });

    pane.addInput(params, "H", {
        label: "H",
        min: .1,
        max: .9,
        step: .1,
    });

    pane.addInput(params, "DRAW_REGIONS", {
        label: "Draw Regions",
    });
    pane.addInput(params, "DRAW_TOOLS", {
        label: "Draw Tools",
    });

    pane.on("change", () => {
        COLUMNS = WIDTH / params.GRID_SIZE;
        ROWS = HEIGHT / params.GRID_SIZE;
        redraw();
    });
}

// draw the regions on the canvas

let regions = [];
function draw() {
    regions = [];
    packRegion(
        new Region(
            0,
            0,
            COLUMNS * params.GRID_SIZE,
            ROWS * params.GRID_SIZE,
        ),
    );

    push();
    translate(-WIDTH / 2, -HEIGHT / 2);

    background(0, .2, .2);
    noStroke();

    // Draw each region as a rectangle
    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];

        if (params.DRAW_REGIONS) {
            fill("red");
            rrect(region.insetRegion(params.GAP));

            fill(.2, .0, map(i, 0, regions.length, 0, 1));
            rrect(region.insetRegion(params.BORDER + params.GAP));
        }

        if (params.DRAW_TOOLS) {
            drawTools(region.insetRegion(params.BORDER + params.GAP));
        }
    }
    pop();
}

function drawTools(region) {
    const type = random(["circle", "circle", "square", "square", "none"]);
    const size = random([.9, .75, .5, .25]);
    const density = max(random(.5, 1), random(.5, 1)); // high bias .5 to 1
    const hue = random(1);
    for (
        let y = region.y;
        y < region.y + region.height;
        y += params.GRID_SIZE
    ) {
        for (
            let x = region.x;
            x < region.x + region.width;
            x += params.GRID_SIZE
        ) {
            if (random() > density) continue;
            push();
            translate(x, y);
            translate(params.GRID_SIZE / 2, params.GRID_SIZE / 2);
            fill(0, 0, .4);
            if (type === "square") {
                rectMode(CENTER);
                rect(0, 0, params.GRID_SIZE * size);
            }
            if (type === "circle") {
                ellipse(0, 0, params.GRID_SIZE * size);
            }

            translate(-1, -1);
            fill(hue, .2, random(.8, 1));
            if (type === "square") {
                rectMode(CENTER);
                rect(0, 0, params.GRID_SIZE * size);
            }
            if (type === "circle") {
                ellipse(0, 0, params.GRID_SIZE * size);
            }
            pop();
        }
    }
}

// fills a target region with randomly placed regions
function packRegion(container, max = 1000) {
    // keep going until we can't place any more regions or we reach the max

    for (let i = 0; i < max; i++) {
        const r = placeRegion(container);
        if (r) {
            regions.push(r);
        } else {
            break;
        }
    }
}

// attempts to place a region within a container
// starts with a region half the size of the container
// keeps halving down to gridxgrid size
function placeRegion(container) {
    // start with a region the size of the board
    const region = new Region(
        container.x,
        container.y,
        container.width,
        container.height,
    );

    do {
        halveRegion(region);

        // find all locations, shuffle them
        const possibleLocations = params.SHUFFLE
            ? shuffle(listPossibleLocations(region))
            : listPossibleLocations(region);

        // try each position to find an open space
        for (const location of possibleLocations) {
            region.x = location.col * params.GRID_SIZE;
            region.y = location.row * params.GRID_SIZE;

            if (!region.overlapsAny(regions)) {
                // found one, return it
                return region;
            }
        }

        // stop looking if the region has been shrunk to the minimum size
    } while (
        region.width > params.GRID_SIZE || region.height > params.GRID_SIZE
    );

    // no placement found, return null
    return null;
}

// shrink the region to half its width and height, rounded up to the grid
function halveRegion(region) {
    region.width *= params.H;
    region.width = Math.floor(region.width / params.GRID_SIZE) *
        params.GRID_SIZE;
    region.height *= params.H;
    region.height = Math.floor(region.height / params.GRID_SIZE) *
        params.GRID_SIZE;

    region.width = Math.max(region.width, params.GRID_SIZE);
    region.height = Math.max(region.height, params.GRID_SIZE);
}

// generate a list of grid-aligned locations that fit on the board
function listPossibleLocations(region) {
    const maxRow = ROWS - region.height / params.GRID_SIZE;
    const maxCol = COLUMNS - region.width / params.GRID_SIZE;
    const possibleLocations = [];

    for (let row = 0; row <= maxRow; row++) {
        for (let col = 0; col <= maxCol; col++) {
            possibleLocations.push({ col, row });
        }
    }

    return possibleLocations;
}

// return a random integer between min and max
// function randomInt(min, max) {
//     return Math.floor(random(min, max));
// }

class Region {
    // represent a rectangular region
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get top() {
        return this.y;
    }

    get left() {
        return this.x;
    }

    get bottom() {
        return this.y + this.height;
    }

    get right() {
        return this.x + this.width;
    }

    // check if this region overlaps with another
    overlaps(other) {
        return (
            this.left < other.right &&
            this.right > other.left &&
            this.top < other.bottom &&
            this.bottom > other.top
        );
    }

    // check if this region overlaps with any in a list of regions
    overlapsAny(regions) {
        return regions.some((other) => this.overlaps(other));
    }

    // return a new region inset by x and y
    insetRegion(x, y) {
        // if y is not provided, use x
        if (y === undefined) y = x;
        return new Region(
            this.x + x,
            this.y + y,
            this.width - x * 2,
            this.height - y * 2,
        );
    }
}

// draw a rectangle for a given region
function rrect(r, radius = 0) {
    // check if r is a region
    rect(r.x, r.y, r.width, r.height, radius);
}
