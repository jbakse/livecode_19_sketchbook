// ants.js
// This is a simulation of ants, food, and emergent behavior.

// require https://cdn.jsdelivr.net/npm/p5@0.7.3/lib/p5.min.js

// class that defines how ants works
class Ant {
  constructor(x, y, angle, speed) {
    // encapsulate state from arguments
    this.x = x;
    this.y = y;
    this.a = angle;
    this.speed = speed;
    this.currentFood = false;
    this.coolDown = 0;
  }

  update() {
    this.a += 0.01;

    // move self based on bearing and speed
    this.x += sin(this.a) * this.speed;
    this.y += cos(this.a) * this.speed;

    if (this.currentFood) {
      this.currentFood.x = this.x;
      this.currentFood.y = this.y;
    }

    // bounce self off the edges of the screen.
    if (this.x > width) this.a += PI;
    if (this.y > height) this.a += PI;
    if (this.x < 0) this.a += PI;
    if (this.y < 0) this.a += PI;

    if (this.coolDown > 0) {
      this.coolDown--;
      return;
    }

    if (!this.currentFood) {
      // if empty handed, look for food
      for (const food of foods) {
        if (food.held) continue;
        if (dist(this.x, this.y, food.x, food.y) < 10 && !food.held) {
          // pick up food
          this.currentFood = food;
          food.held = true;
          // turn around
          this.a += PI;
          break;
        }
      }
    } else {
      // if we are holding food, look for a new food to drop near
      for (const food of foods) {
        if (food.held) continue;
        if (dist(this.x, this.y, food.x, food.y) < 10) {
          // drop food
          this.currentFood.held = false;
          this.currentFood = false;
          // turn around
          this.a += PI;
          // start cool down
          this.coolDown = 10;
          break;
        }
      }
    }
  }

  render() {
    push();
    fill(this.coolDown ? "blue" : "white");
    ellipse(this.x, this.y, 20, 20);
    pop();
  }
}

// class that defines how food works
class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.held = false;
  }

  update() {
    // food does not move
  }

  render() {
    push();
    fill(150, 0, 0);
    ellipse(this.x, this.y, 10, 10);
    pop();
  }
}

// declare and initialize our program state variables.
const ants = []; // holds all the ants
const foods = []; // holds all the food
const sprites = []; // holds all the ants and all the food

// set up p5 canvas and drawing properties.
function setup() {
  createCanvas(600, 600);
  noStroke();
  fill("white");

  // create ants
  for (let i = 0; i < 10; i++) {
    const ant = new Ant(random(width), random(height), random(TWO_PI), 2);
    ants.push(ant);
    sprites.push(ant);
  }

  // create food
  for (let i = 0; i < 200; i++) {
    const food = new Food(random(width), random(height));
    foods.push(food);
    sprites.push(food);
  }
}

function draw() {
  update();
  render();
}

function update() {
  // tell the sprites to update themselves
  for (const sprite of sprites) {
    sprite.update();
  }
}

function render() {
  // clear the drawing
  background("black");

  // tell the sprites to draw themselves
  for (const sprite of sprites) {
    sprite.render();
  }
}
