// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const sprites = [];

function setup() {
  createCanvas(720, 720);

  for (let i = 0; i < 100; i++) {
    sprites.push(new Ant(width / 2, height / 2));
  }
  for (let i = 0; i < 1000; i++) {
    sprites.push(new FoodItem(random(width), random(height)));
  }
}

function update() {
  for (const sprite of sprites) {
    sprite.update();
  }
}

function draw() {
  update();
  if (mouseIsPressed) {
    for (let i = 0; i < 10; i++) {
      update();
    }
  }

  background(0);
  for (const sprite of sprites) {
    sprite.draw();
  }
}

class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 4;
    this.angle = random(TWO_PI);
    this.food = null;
  }

  update() {
    this.angle += 0.01;

    // sense food
    const foodOnTheGround = sprites.filter(
      (sprite) => sprite instanceof FoodItem && sprite !== this.food
    );

    // if we don't have food
    if (!this.food) {
      for (const foodItem of foodOnTheGround) {
        const distance = dist(this.x, this.y, foodItem.x, foodItem.y);
        if (distance < 10) {
          this.food = foodItem;
          this.angle += PI;
          break;
        }
      }
    } else {
      for (const foodItem of foodOnTheGround) {
        const distance = dist(this.x, this.y, foodItem.x, foodItem.y);
        if (distance < 10) {
          this.food = null;
          this.angle += PI;
          this.y += 12 * sin(this.angle);
          this.x += 12 * cos(this.angle);
          break;
        }
      }
    }

    // move the food with us
    if (this.food) {
      this.food.x = this.x;
      this.food.y = this.y;
    }

    // wrap around the screen
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    // move in the direction of the angle
    this.y += this.speed * sin(this.angle);
    this.x += this.speed * cos(this.angle);
  }

  draw() {
    push();
    fill(255);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
    pop();
  }
}

class FoodItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  update() {
    // no op
  }

  draw() {
    push();
    fill("red");
    noStroke();
    ellipse(this.x, this.y, 5, 5);
    pop();
  }
}
