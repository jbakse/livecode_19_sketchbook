// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

// map will be 4 rooms by 4 rooms, numbered 0 to 15 lrtb
// map will contain (in rough order of implementation)
// an entrance
// an exit
// a treasure
// a locked door
// a key
// a monster

// rooms will be 8 x 8 tiles
// tiles will be 8 x 8 pixels
// full map will be 256x256

// features (in rough order of imlementation)
// generate a level
// draw the level
// draw the player
// allow player to move
// allow player to collect treasure (score)
// allow player to be killed by monster
// allow player to kill monster

const FLOOR = 0;
const WALL = 1;

let level;

function setup() {
  createCanvas(512, 512);
  noStroke();
  generateLevel();
}

function draw() {
  background(0);
  scale(2);
  drawMap(level.map);
  for (const sprite of level.sprites) {
    sprite.step();
  }
  for (const sprite of level.sprites) {
    sprite.draw();
  }
}

function generateLevel() {
  const old_level = level;
  level = {};
  level.map = generateMap();
  const d = new Deck(range(0, 16));

  level.sprites = [];

  {
    const room = d.next();
    const row = floor(room / 4);
    const col = room % 4;
    let x = col * 8 + randomInt(2, 6);
    let y = row * 8 + randomInt(2, 6);

    // if we have an old level, override the entrance with old exit position
    // since we aren't using the room from the deck,
    // we might end up putting something else in this room if we are putting enough things in
    if (old_level) {
      x = old_level.exit.col;
      y = old_level.exit.row;
    }
    level.entrance = new Entrance(x, y);
    level.sprites.push(level.entrance);
    level.player = new Player(x, y);
    level.sprites.push(level.player);
  }
  {
    const room = d.next();
    const row = floor(room / 4);
    const col = room % 4;
    const x = col * 8 + randomInt(2, 6);
    const y = row * 8 + randomInt(2, 6);
    level.exit = new Exit(x, y);
    level.sprites.push(level.exit);
  }
}
function generateMap() {
  const m = [];
  for (let col = 0; col < 32; col++) {
    m[col] = [];
    for (let row = 0; row < 32; row++) {
      m[col][row] = FLOOR;

      // walls
      if (col % 8 === 0) m[col][row] = WALL;
      if (col % 8 === 7) m[col][row] = WALL;
      if (row % 8 === 0) m[col][row] = WALL;
      if (row % 8 === 7) m[col][row] = WALL;
    }
  }

  // doors
  // visit the upper left 9 rooms and punch doors left or down
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let direction = random() < 0.5 ? "left" : "down";

      if (col === 3) {
        direction = "down";
      }
      if (row === 3) {
        direction = "left";
      }
      if (col === 3 && row === 3) {
        direction = "none";
      }
      if (direction === "left") {
        m[col * 8 + 7][row * 8 + 3] = FLOOR;
        m[col * 8 + 8][row * 8 + 3] = FLOOR;
        m[col * 8 + 7][row * 8 + 4] = FLOOR;
        m[col * 8 + 8][row * 8 + 4] = FLOOR;
      }
      if (direction === "down") {
        m[col * 8 + 3][row * 8 + 7] = FLOOR;
        m[col * 8 + 3][row * 8 + 8] = FLOOR;
        m[col * 8 + 4][row * 8 + 7] = FLOOR;
        m[col * 8 + 4][row * 8 + 8] = FLOOR;
      }
    }
  }

  return m;
}

class Player {
  constructor(col, row) {
    this.col = col;
    this.row = row;

    document.addEventListener("keydown", (e) => this.keydown(e));
  }

  keydown(e) {
    if (e.key === "ArrowLeft") this.move(-1, 0);
    if (e.key === "ArrowRight") this.move(1, 0);
    if (e.key === "ArrowUp") this.move(0, -1);
    if (e.key === "ArrowDown") this.move(0, 1);
    if (e.key === "a") this.move(-1, 0);
    if (e.key === "d") this.move(1, 0);
    if (e.key === "w") this.move(0, -1);
    if (e.key === "s") this.move(0, 1);
    // if (e.key === " ") controls.fire = true;
  }

  move(x, y) {
    const target_col = this.col + x;
    const target_row = this.row + y;
    if (level.map[target_col][target_row] === WALL) return false;

    for (const sprite of level.sprites) {
      if (sprite === this) continue;
      if (sprite.col === target_col && sprite.row === target_row) {
        const result = sprite.bump();
        if (!result) return false;
      }
    }
    this.col = target_col;
    this.row = target_row;
    return true;
  }

  step() {}

  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill("yellow");
    ellipseMode(CORNER);
    ellipse(0, 0, 8, 8);
    pop();
  }
}

class Entrance {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  step() {}
  bump() {
    return true;
  }
  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill(50);
    rect(0, 0, 8, 8);
    // triangle(8, 0, 8, 8, 0, 8);

    pop();
  }
}

class Exit {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  step() {}
  bump() {
    console.log("exit");
    generateLevel();
    return false;
  }
  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill(250);

    triangle(8, 0, 8, 8, 0, 8);

    pop();
  }
}

function drawMap(m) {
  for (let col = 0; col < 32; col++) {
    for (let row = 0; row < 32; row++) {
      push();
      translate(col * 8, row * 8);
      if (m[col][row] === FLOOR) fill(20);
      if (m[col][row] === WALL) fill(150);
      rect(0, 0, 8, 8);
      pop();
    }
  }
}

class Deck {
  constructor(a) {
    this.a = shuffle(a);
    this.index = 0;
  }

  next() {
    const value = this.a[this.index];
    this.index++;
    if (this.index === this.a.length) {
      this.a = shuffle(this.a);
      this.index = 0;
    }
    return value;
  }
}

function randomInt(a, b) {
  return floor(random(a, b));
}

function range(min, max, step = 1) {
  const a = [];
  for (let i = min; i < max; i += step) {
    a.push(i);
  }
  return a;
}
