let palette = [
    "#EAB69F",
    "#E5987F",
    "#E07A5F",
    "#8F5D5D",
    "#3D405B",
    "#5F797B",
    "#81B29A",
    "#BABF95",
    "#F2CC8F",
    "#B86C5E",
];

let currentColor;

let drops = [];

function setup() {
    createCanvas(400, 400);
}

function draw() {
    // update state
    if (mouseIsPressed) {
        drops.push(new Drop(mouseX, mouseY));
    }

    for (const drop of drops) {
        drop.update();
    }

    //filter drops
    drops = drops.filter((drop) => drop.isAlive());

    // draw
    noStroke();
    background("#f5f5f5");

    for (const drop of drops) {
        drop.show();
    }
}

function mousePressed() {
    currentColor = color(random(palette));
}

class Drop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.numLayers = 5;
        this.radius = 5;
        this.age = 0;
        this.scale = random(0.5, 1);
        this.rate = random(0.04, 0.05);
        this.color = currentColor;

        //doing this to add more variety to each drop
        this.layerValues = new Array(this.numLayers);
        for (let i = 0; i < this.numLayers; i++) {
            this.layerValues[i] = {};
            this.#setColor(i);
            this.#setAngles(i);
            this.#setRadii(i);
        }
    }

    #setColor(index) {
        this.r = randomGaussian(this.color.levels[0], 5);
        this.g = randomGaussian(this.color.levels[1], 5);
        this.b = randomGaussian(this.color.levels[2], 5);
        this.layerValues[index].color = color(this.r, this.g, this.b, 5);
    }

    #setAngles(index) {
        this.layerValues[index].angle = random(PI * 2);
    }

    #setRadii(index) {
        let radii = [];
        let thetas = [];
        for (let i = 0; i < PI * 2; i += 0.5) {
            radii.push(randomGaussian(this.radius, this.radius / 10));
            thetas.push(random(PI * 2));
        }
        this.layerValues[index].radii = radii;
        this.layerValues[index].thetas = thetas;
    }

    #increase() {
        this.scale += this.rate;
    }

    #decrease() {
        this.scale -= 0.5;
    }

    update() {
        this.age++;
        if (this.age < 70) {
            this.#increase();
        } else if (this.age > 300) {
            this.#decrease();
        }
    }

    isAlive() {
        if (this.scale > 0) {
            return true;
        }
    }

    show() {
        for (let i = 0; i < this.numLayers; i++) {
            fill(this.layerValues[i].color);
            push();
            translate(this.x, this.y);
            rotate(this.layerValues[i].angle);
            scale(this.scale);
            beginShape();
            for (let j = 0; j < PI * 2; j += 0.5) {
                let x = cos(j + this.layerValues[i].thetas[j]) *
                    this.layerValues[i].radii[j];
                let y = sin(j + this.layerValues[i].thetas[j]) *
                    this.layerValues[i].radii[j];
                vertex(x, y);
            }
            endShape();
            pop();
        }
    }
}
