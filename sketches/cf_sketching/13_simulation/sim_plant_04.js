// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const PLANT_SCALE = 5;
class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.mass = 4;
        this.water = this.mass;
        this.food = this.mass;
        this.health = this.mass;
        this.rootSize = pow(this.mass, 1 / 2) * PLANT_SCALE;
        this.crownSize = pow(this.mass, 1 / 3) * PLANT_SCALE;
    }

    step() {
        /// live

        this.water -= this.mass * .06;

        if (this.water > 0) {
            this.health += 1;
        }

        if (this.water < 1) {
            this.health -= 1;
        }

        /// seed
        if (this.health > 20 && random() < .05) {
            const location = randomPointInCircle();
            plants.push(
                new Plant(
                    this.x + location.x * this.crownSize * 1.5,
                    this.y + location.y * this.crownSize * 1.5,
                ),
            );
            this.mass -= 4;
        }

        /// grow
        if (this.food > 0) {
            this.mass += 1;
            this.food -= 1;
        }

        /// die
        if (this.health < 1) {
            times(this.mass, () => {
                const location = randomPointInCircle();
                const newFood = new Food(
                    this.x + location.x * this.crownSize * .75,
                    this.y + location.y * this.crownSize * .75,
                );
                foods.push(
                    newFood,
                );
            });
        }

        /// constrain and update values
        this.mass = constrain(this.mass, 0, 400);
        this.water = constrain(this.water, 0, 100);
        this.food = constrain(this.food, 0, 100);
        this.health = constrain(this.health, 0, this.mass);
        this.rootSize = pow(this.mass, 1 / 2) * PLANT_SCALE;
        this.crownSize = pow(this.mass, 1 / 3) * PLANT_SCALE;
    }

    draw() {
        push();

        // crown
        const green = color("#060");
        const brown = color("#420");
        const crownColor = lerpColor(
            brown,
            green,
            this.health / this.mass,
        );
        fill(crownColor);
        ellipse(this.x, this.y, this.crownSize);

        // selection
        this === watchedPlant ? stroke("red") : noStroke();
        noFill();
        ellipse(this.x, this.y, this.crownSize);

        pop();
    }

    drawRoot() {
        push();
        fill("#0909");
        noStroke();
        ellipse(this.x, this.y, this.rootSize);
        pop();
    }
}

class Water {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.mass = 12;
    }

    step() {
        this.mass -= 1;
    }

    draw() {
        push();
        fill("#58f8");
        ellipse(this.x, this.y, pow(this.mass, 1 / 2));
        pop();
    }
}

class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.mass = 1;
    }

    step() {
        // this.x += random(-1, 1);
        // this.y += random(-1, 1);
    }

    draw() {
        push();
        fill("gray");
        ellipse(this.x, this.y, 2);
        pop();
    }
}

let watchedPlant;
let plants = [];
let waters = [];
let foods = [];
let things = [];

let output;
function setup() {
    createCanvas(720, 480);

    times(10, () => {
        plants.push(new Plant(random(width), random(height)));
    });
    times(100, () => {
        waters.push(new Water(random(width), random(height)));
    });
    times(10000, () => {
        foods.push(new Food(random(width), random(height)));
    });

    things.push(...plants, ...waters, ...foods);
    watchedPlant = plants[0];

    // create output div
    output = document.createElement("div");
    output.style.whiteSpace = "pre";
    document.body.appendChild(output);
}

function update() {
    /// make rain
    times(100, () => {
        waters.push(new Water(random(width), random(height)));
    });

    /// blown seeds
    if (random() < .001) {
        times(1, () => {
            plants.push(new Plant(random(width), random(height)));
        });
    }

    /// sort plants big first, so they get fed first
    plants.sort((a, b) => b.mass - a.mass);

    /// feed plants
    for (const plant of plants) {
        for (const water of waters) {
            if (
                abs(plant.x - water.x) < plant.rootSize * .5 && // pre check for speed
                abs(plant.y - water.y) < plant.rootSize * .5 && // pre check for speed
                dist(plant.x, plant.y, water.x, water.y) < plant.rootSize * .5
            ) {
                plant.water += water.mass;
                water.mass = 0;
            }
        }
        for (const food of foods) {
            if (
                abs(plant.x - food.x) < plant.rootSize * .5 && // pre check for speed
                abs(plant.y - food.y) < plant.rootSize * .5 && // pre check for speed
                dist(plant.x, plant.y, food.x, food.y) < plant.rootSize * .5
            ) {
                plant.food += food.mass;
                food.mass = 0;
            }
        }
    }

    /// step everything
    for (const thing of things) {
        thing.step();
    }

    /// cull dead things
    plants = plants.filter((plant) => plant.health > 0);
    waters = waters.filter((water) => water.mass > 0);
    foods = foods.filter((food) => food.mass > 0);
    things = [...plants, ...waters, ...foods];

    /// set watched plant to closest plant to cursor
    if (plants.length > 0) {
        let closestPlant = plants[0];
        let closestDist = dist(closestPlant.x, closestPlant.y, mouseX, mouseY);
        for (const plant of plants) {
            const d = dist(plant.x, plant.y, mouseX, mouseY);
            if (d < closestDist) {
                closestPlant = plant;
                closestDist = d;
            }
        }
        watchedPlant = closestPlant;
    } else {
        watchedPlant = null;
    }
}
function draw() {
    // update();
    times(10, update);

    background("tan");
    noStroke();

    for (const plant of plants) {
        plant.drawRoot();
    }

    for (const food of foods) {
        food.draw();
    }

    for (const water of waters) {
        water.draw();
    }

    /// sort plants big last, so they get drawn on top
    plants.sort((a, b) => a.mass - b.mass);
    for (const plant of plants) {
        plant.draw();
    }

    // set text to plant stats
    output.innerText = plants.length + "\n" +
        JSON.stringify(watchedPlant, null, 2);
}

function times(t, f) {
    let a = [];
    for (let i = 0; i < t; i++) {
        a.push(f(i));
    }
    return a;
}

function randomPointInCircle() {
    let r = sqrt(random());
    let a = random() * TWO_PI;
    return { x: cos(a) * r, y: sin(a) * r };
}
