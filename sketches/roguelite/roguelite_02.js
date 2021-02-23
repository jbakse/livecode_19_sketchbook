// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/*exported setup draw */

// map will be 4 rooms by 4 rooms, numbered 0 to 15 lrtb
// map will contain (in rough order of implementation)
// [x] an entrance
// [x] an exit
// [x] a treasure
// [ ] a locked door
// [ ] a key
// [ ] a monster

// rooms will be 8 x 8 tiles
// tiles will be 8 x 8 pixels
// full map will be 256x256

// features (in rough order of imlementation)
// [ ] generate a level
// [ ] draw the level
// [ ] draw the player
// [ ] allow player to move
// allow player to collect treasure (score)
// allow player to be killed by monster
// allow player to kill monster

const FLOOR = 0;
const WALL = 1;

const controls = {
  left: false,
  right: false,
  up: false,
  down: false,
};

const control_counts = {
  left: 0,
  right: 0,
  up: 0,
  down: 0,
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") controls.left = true;
  if (e.key === "ArrowRight") controls.right = true;
  if (e.key === "ArrowUp") controls.up = true;
  if (e.key === "ArrowDown") controls.down = true;
  if (e.key === "a") controls.left = true;
  if (e.key === "d") controls.right = true;
  if (e.key === "w") controls.up = true;
  if (e.key === "s") controls.down = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") controls.left = false;
  if (e.key === "ArrowRight") controls.right = false;
  if (e.key === "ArrowUp") controls.up = false;
  if (e.key === "ArrowDown") controls.down = false;
  if (e.key === "a") controls.left = false;
  if (e.key === "d") controls.right = false;
  if (e.key === "w") controls.up = false;
  if (e.key === "s") controls.down = false;
});

let level;
let player;

function setup() {
  createCanvas(512, 528);
  noStroke();
  player = new Player();
  generateLevel();
}

function draw() {
  background(0);
  scale(2);

  if (!controls.left) control_counts.left = 0;
  if (!controls.right) control_counts.right = 0;
  if (!controls.up) control_counts.up = 0;
  if (!controls.down) control_counts.down = 0;

  if (controls.left) control_counts.left++;
  if (controls.right) control_counts.right++;
  if (controls.up) control_counts.up++;
  if (controls.down) control_counts.down++;

  if (control_counts.left % 10 === 1) player.move(-1, 0);
  if (control_counts.right % 10 === 1) player.move(1, 0);
  if (control_counts.up % 10 === 1) player.move(0, -1);
  if (control_counts.down % 10 === 1) player.move(0, 1);

  drawMap(level.map);
  for (const sprite of level.sprites) {
    sprite.step();
  }
  player.step();
  for (const sprite of level.sprites) {
    sprite.draw();
  }
  player.draw();

  for (let t = 0; t < player.treasure; t++) {
    fill("yellow");
    ellipse(t * 8 + 4, 260, 3, 3);
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
    if (old_level) {
      x = old_level.exit.col;
      y = old_level.exit.row;
    }
    level.entrance = new Entrance(x, y);
    level.sprites.push(level.entrance);
    player.col = x;
    player.row = y;
  }
  {
    const room = d.next();
    const row = floor(room / 4);
    const col = room % 4;
    const x = col * 8 + randomInt(2, 6);
    const y = row * 8 + randomInt(2, 6);
    level.exit = new Exit(x, y);
    level.sprites.push(level.exit);
    level.exit_room = room;
  }

  {
    const room = d.next();
    const row = floor(room / 4);
    const col = room % 4;
    const x = col * 8 + randomInt(2, 6);
    const y = row * 8 + randomInt(2, 6);
    const treasure = new Treasure(x, y);
    level.sprites.push(treasure);
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
  constructor(col = 0, row = 0) {
    this.col = col;
    this.row = row;
    this.treasure = 0;
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
    fill("red");
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
    fill(100);
    triangle(8, 0, 8, 8, 0, 8);
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

class Treasure {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  step() {}
  bump() {
    array_remove(level.sprites, this);
    player.treasure++;
    return true;
  }
  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill("yellow");
    triangle(0, 8, 4, 4, 8, 8);
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

function array_remove(a, item) {
  const index = a.indexOf(item);
  if (index > -1) {
    a.splice(index, 1);
  }
}
