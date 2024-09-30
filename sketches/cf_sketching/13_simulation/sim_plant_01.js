// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.water = 10;
        this.food = 10;
        this.size = 10;
        this.leafSize = 10;
    }

    step() {
        /// live
        this.water -= 1;
        this.food -= 1;

        /// grow
        if (this.food > 0 && this.water > 0 && this.size > this.leafSize + 5) {
            this.leafSize += 1;
            this.water -= 1;
            this.food -= 1;
        }
        if (this.food > 5 && this.water > 5) {
            this.size += 2;
            this.water -= 1;
            this.food -= 1;
        }

        /// wither
        if (this.water < 1 || this.food < 1) {
            this.leafSize -= 1;
        }
        if (this.leafSize < 1) {
            this.size -= 1;
        }

        /// die
        if (this.size < 1) {
            times(10, () => {
                foods.push(
                    new Food(
                        this.x + random(-10, 10),
                        this.y + random(-10, 10),
                    ),
                );
            });
        }

        this.water = constrain(this.water, 0, 100);
        this.food = constrain(this.food, 0, 100);
        this.size = constrain(this.size, 0, 100);
        this.leafSize = constrain(this.leafSize, 0, this.size);
    }

    draw() {
        push();
        fill("#0603");
        ellipse(this.x, this.y, this.size);
        fill("#060");
        ellipse(this.x, this.y, this.leafSize);
        pop();
    }
}

class Water {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 12;
    }

    step() {
        this.size -= 1;
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
        this.size = 1;
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
}

function update() {
    /// make rain
    times(100, () => {
        waters.push(new Water(random(width), random(height)));
    });

    /// blown seeds
    times(1, () => {
        plants.push(new Plant(random(width), random(height)));
    });

    /// step everything
    for (const thing of things) {
        thing.step();
    }

    /// feed plants
    for (const plant of plants) {
        for (const water of waters) {
            if (dist(plant.x, plant.y, water.x, water.y) < plant.size * .5) {
                plant.water += water.size;
                water.size = 0;
            }
        }
        for (const food of foods) {
            if (dist(plant.x, plant.y, food.x, food.y) < plant.size * .5) {
                plant.food += food.size;
                food.size = 0;
            }
        }
    }

    /// cull dead things
    plants = plants.filter((plant) => plant.size > 0);
    waters = waters.filter((water) => water.size > 0);
    foods = foods.filter((food) => food.size > 0);
    things = [...plants, ...waters, ...foods];
}
function draw() {
    update();

    background("tan");
    noStroke();

    for (const thing of things) {
        thing.draw();
    }

    console.log(watchedPlant);
}

function times(t, f) {
    let a = [];
    for (let i = 0; i < t; i++) {
        a.push(f(i));
    }
    return a;
}
