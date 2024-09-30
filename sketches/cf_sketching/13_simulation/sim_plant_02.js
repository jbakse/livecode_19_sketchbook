// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.water = 10;
        this.food = 10;
        this.mass = 2;
        this.health = 2;
    }

    step() {
        /// live

        // water needs increase quadratically with mass
        // root size also increases quadratically with mass

        this.water -= this.mass * this.mass * .004;

        if (this.water > 0) {
            this.health += 1;
        }

        if (this.water < 1) {
            this.health -= 1;
        }

        /// seed
        if (this.health > 10 && random() < .04) {
            times(1, () => {
                plants.push(
                    new Plant(
                        this.x + random(-this.mass * 2, this.mass * 2),
                        this.y + random(-this.mass * 2, this.mass * 2),
                    ),
                );
            });
        }

        /// grow
        if (this.food > 0) {
            this.mass += 1;
            this.food -= 1;
        }

        /// die
        if (this.health < 1) {
            times(this.mass, () => {
                const newFood = new Food(
                    this.x + random(-this.mass, this.mass),
                    this.y + random(-this.mass, this.mass),
                );
                foods.push(
                    newFood,
                );
            });
        }

        this.water = constrain(this.water, 0, 100);
        this.food = constrain(this.food, 0, 100);
        this.mass = constrain(this.mass, 0, 100);
        this.health = constrain(this.health, 0, this.mass);
    }

    draw() {
        push();

        const green = color("#060");
        const brown = color("#420");
        const c = lerpColor(brown, green, this.health / min(this.mass, 10));
        fill(c);
        this === watchedPlant ? stroke("red") : noStroke();
        ellipse(this.x, this.y, this.mass);

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
        fill("blue");
        ellipse(this.x, this.y, 2);
        pop();
    }
}

class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.mass = 1;
    }

    step() {}

    draw() {
        push();
        fill("brown");
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

    times(100, () => {
        plants.push(new Plant(random(width), random(height)));
    });
    times(100, () => {
        waters.push(new Water(random(width), random(height)));
    });
    times(1000, () => {
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
    if (random() < .01) {
        times(1, () => {
            plants.push(new Plant(random(width), random(height)));
        });
    }

    /// sort plants big first, so they get fed first
    plants.sort((a, b) => b.mass - a.mass);

    /// feed plants
    for (const plant of plants) {
        for (const water of waters) {
            if (dist(plant.x, plant.y, water.x, water.y) < plant.mass * .5) {
                plant.water += water.mass;
                water.mass = 0;
            }
        }
        for (const food of foods) {
            if (dist(plant.x, plant.y, food.x, food.y) < plant.mass * .5) {
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
    }
}
function draw() {
    update();

    background("tan");
    noStroke();

    for (const thing of things) {
        thing.draw();
    }

    // set text to plant stats
    output.innerText = JSON.stringify(watchedPlant, null, 2);
}

function times(t, f) {
    let a = [];
    for (let i = 0; i < t; i++) {
        a.push(f(i));
    }
    return a;
}
