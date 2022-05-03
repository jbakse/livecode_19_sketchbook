// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

class Dispatcher {
  constructor() {
    this.listeners = {};
  }
  on(event, callback) {
    if (typeof event !== "string") return;
    if (typeof callback !== "function") return;
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  send(event, ...data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback(...data));
  }
}

const gameDispatcher = new Dispatcher();
gameDispatcher.on("test", (...args) => {
  console.log("test", ...args);
});
gameDispatcher.send("test", 1, 2, 3);

class Jumper {
  constructor() {
    this.x = 250;
    this.y = 250;
    this.dX = 0;
    this.dY = 0;
    this.radius = 10;
    this.isGrounded = false;

    this.jumpButton = new KeyListener(" ");
    // this.jumpButton.onPress = this.jump.bind(this);

    this.leftButton = new KeyListener("ArrowLeft");
    this.rightButton = new KeyListener("ArrowRight");
  }

  // jump() {
  //   if (this.isGrounded) {
  //     this.dY = -20;
  //   }
  // }

  step(t) {
    // console.log(this.dY, this.isGrounded);

    // forces - gravity
    // if (!this.isGrounded) {
    this.dY += 1 * t;
    // }

    // input - left/right
    const grip = this.isGrounded ? 0.25 : 0.1;
    if (this.leftButton.isDown) {
      this.dX = lerp(this.dX, -10, grip * t);
    } else if (this.rightButton.isDown) {
      this.dX = lerp(this.dX, 10, grip * t);
    } else {
      this.dX = lerp(this.dX, 0, 2 * grip * t);
    }

    // input - jump
    if (
      this.jumpButton.isDown &&
      this.jumpButton.framesDown < 3 &&
      this.isGrounded
    ) {
      this.dY = -20;
    }

    // move
    // this.x += this.dX * t;
    // this.y += this.dY * t;
    this.moveHorizontal(this.dX * t);
    this.isGrounded = false;
    this.moveVertical(this.dY * t);

    // floor hit
    if (this.y + this.radius > 500) {
      // push back
      this.y = 500 - this.radius;
      // stop vertical movement
      this.dY = 0;
    }

    if (this.y + this.radius === 500) {
      this.isGrounded = true;
    }

    // safety
    //   this.y = clamp(this.y, this.radius, 500 - this.radius);
    this.x = clamp(this.x, this.radius, 500 - this.radius);
  }

  moveHorizontal(amount) {
    const sign = amount < 0 ? -1 : 1;
    let amountLeft = abs(amount);
    while (amountLeft > 0) {
      let delta = min(amountLeft, 1);
      if (sign === 1 && World.blocked(this.x + this.radius, this.y)) {
        this.dX = -abs(this.dX) * 0.5;
        delta = 0;
        amountLeft = 0;
      }
      if (sign === -1 && World.blocked(this.x - this.radius, this.y)) {
        this.dX = abs(this.dX) * 0.5;
        delta = 0;
        amountLeft = 0;
      }
      this.x += delta * sign;
      amountLeft -= delta;
    }
  }

  moveVertical(amount) {
    const sign = amount < 0 ? -1 : 1;
    let amountLeft = abs(amount);
    while (amountLeft > 0) {
      let delta = min(amountLeft, 1);
      if (sign === 1 && World.blocked(this.x, this.y + this.radius)) {
        this.dY = 0;
        this.isGrounded = true;
        delta = 0;
        amountLeft = 0;
      }
      if (sign === -1 && World.blocked(this.x, this.y - this.radius)) {
        this.dY = abs(this.dY) * 0.5;
        delta = 0;
        amountLeft = 0;
      }
      this.y += delta * sign;
      amountLeft -= delta;
    }
  }

  draw() {
    push();
    noStroke();
    fill(150);
    if (this.isGrounded) {
      fill(100, 200, 255);
    }
    ellipseMode(CENTER);
    translate(this.x, this.y);
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }
}

class KeyListener {
  constructor(key) {
    this.key = key;
    this.isDown = false;
    this.framesDown = 0;
    this.framesUp = 0;
    this.wasPressed = false;
    this.wasReleased = false;
    window.addEventListener("keydown", (event) => {
      if (event.key === this.key && !this.isDown) {
        this.isDown = true;
        this.wasPressed = true;
        if (this.onPress) this.onPress();
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === this.key && this.isDown) {
        this.isDown = false;
        this.wasReleased = true;
        if (this.onRelease) this.onRelease();
      }
    });

    gameDispatcher.on("updateComplete", this.update.bind(this));
  }
  update() {
    this.wasPressed = false;
    this.wasReleased = false;
    if (this.isDown) {
      this.framesDown++;
      this.framesUp = 0;
    } else {
      this.framesDown = 0;
      this.framesUp++;
    }
  }
}

class World {
  draw() {
    this;

    push();
    for (let y = -100; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const worldRow = y;
        const worldColumn = x;

        if (World.getBlock(worldColumn, worldRow) === "block") {
          noStroke();
          fill(200);
          rect(x * 50, y * 50, 50, 50);
        }
      }
    }
    pop();
  }

  static getBlock(col, row) {
    noiseDetail(1);
    let type = "empty";
    const value = noise(col, row, 0);
    if (col === 0) type = "block";
    if (col === 9) type = "block";
    if (value < 0.15) type = "block";
    if (floor(row / 10) % 2 === 0) {
      if (col === 4 || col === 5) type = "empty";
    } else {
      if (col === 3 || col === 6) type = "empty";
    }
    return type;
  }

  static blocked(x, y) {
    const col = floor(x / 50);
    const row = floor(y / 50);
    if (World.getBlock(col, row) !== "empty") {
      return true;
    }
    return false;
  }
  static drawBlock(x, y, width, height) {
    push();

    pop();
  }
}

const jumper = new Jumper();
const world = new World();
let cameraY = 0;

function setup() {
  createCanvas(500, 500);
  background(0, 50, 0);
}

function draw() {
  background(50);
  translate(0, -cameraY);
  world.draw(0);

  jumper.step(1);
  jumper.draw();

  cameraY = lerp(cameraY, jumper.y - 350, 0.1);

  fill(255);
  text(`fps: ${floor(frameRate())}`, 10, 20);

  gameDispatcher.send("updateComplete");
}

function clamp(value, min, max) {
  if (min > max) {
    // neat, thanks es6!
    [min, max] = [max, min];
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
