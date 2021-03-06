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
const ROOM_COLS = 5;
const ROOM_ROWS = 5;
const ROOM_WIDTH = 8;
const ROOM_HEIGHT = 8;

class Sprite {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }
  step() {}
  draw() {}
  bump(/*bumper*/) {
    return true;
  }
}
class Entrance extends Sprite {
  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill(100);
    triangle(8, 0, 8, 8, 0, 8);
    pop();
  }
}

class Exit extends Sprite {
  bump(/*bumper*/) {
    generateLevel();
    return true;
  }
  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill(250);
    triangle(8, 0, 8, 8, 0, 8);
    pop();
  }
}

class Treasure extends Sprite {
  step() {}
  bump(bumper) {
    array_remove(level.sprites, this);
    bumper.hasOwnProperty("treasure") && bumper.treasure++;
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
class Player extends Sprite {
  constructor(col, row) {
    super(col, row);
    this.treasure = 0;
  }

  move(x, y) {
    const target_col = this.col + x;
    const target_row = this.row + y;
    if (level.map[target_col][target_row] === WALL) return false;

    for (const sprite of level.sprites) {
      if (sprite === this) continue;
      if (sprite.col === target_col && sprite.row === target_row) {
        const allowed = sprite.bump(this);
        if (!allowed) return false;
      }
    }
    this.col = target_col;
    this.row = target_row;

    level.visited[floor(this.col / 8)][floor(this.row / 8)] = true;

    return true;
  }

  step() {
    if (input.buttonDown("left")) player.move(-1, 0);
    if (input.buttonDown("right")) player.move(1, 0);
    if (input.buttonDown("up")) player.move(0, -1);
    if (input.buttonDown("down")) player.move(0, 1);
  }

  draw() {
    push();
    translate(this.col * 8, this.row * 8);
    fill("red");
    ellipseMode(CORNER);
    ellipse(0, 0, 8, 8);
    pop();
  }
}

let level;
let player = new Player();
let input = new InputManager();

function setup() {
  createCanvas(800, 800);
  noStroke();
  generateLevel();
}

function step() {
  input.step();
  for (const sprite of level.sprites) {
    sprite.step();
  }
}

function draw() {
  step();

  background(0);
  scale(2);
  drawMap(level.map);
  for (const sprite of level.sprites) {
    if (
      level.visited[floor(sprite.col / ROOM_WIDTH)][
        floor(sprite.row / ROOM_HEIGHT)
      ]
    ) {
      sprite.draw();
    }
  }
  drawUI();
}

function drawUI() {
  push();
  fill("yellow");
  for (let t = 0; t < player.treasure; t++) {
    ellipse(t * 8 + 4, 260, 3, 3);
  }
  pop();
}

function generateLevel() {
  const old_level = level;
  level = {};

  level.visited = [];
  for (let i = 0; i < ROOM_COLS; i++) {
    level.visited.push([]);
  }

  // level.visited = makeArray(ROOM_COLS, ROOM_ROWS);

  level.map = generateMap();

  const d = new Deck(range(0, 16));

  if (old_level) {
    d.remove(old_level.exit_room);
  }

  level.sprites = [];

  // place entrance
  {
    let col, row;
    if (old_level) {
      col = old_level.exit.col;
      row = old_level.exit.row;
    } else {
      const room = d.next();
      const room_col = room % 4;
      const room_row = floor(room / 4);
      col = room_col * 8 + randomInt(2, 6);
      row = room_row * 8 + randomInt(2, 6);
    }
    level.entrance = new Entrance(col, row);
    level.sprites.push(level.entrance);
  }

  // place player
  player.col = level.entrance.col;
  player.row = level.entrance.row;
  level.sprites.push(player);

  level.visited[floor(player.col / 8)][floor(player.row / 8)] = true;

  // place exit
  {
    const room = d.next();
    const room_col = room % 4;
    const room_row = floor(room / 4);
    const col = room_col * 8 + randomInt(2, 6);
    const row = room_row * 8 + randomInt(2, 6);
    level.exit = new Exit(col, row);
    level.sprites.push(level.exit);
    level.exit_room = room;
  }

  // place treasure
  times(3, () => {
    const room = d.next();
    const room_col = room % 4;
    const room_row = floor(room / 4);
    const col = room_col * 8 + randomInt(2, 6);
    const row = room_row * 8 + randomInt(2, 6);
    const treasure = new Treasure(col, row);
    level.sprites.push(treasure);
  });
}

function generateMap() {
  const m = [];

  for (let col = 0; col < ROOM_COLS * ROOM_WIDTH; col++) {
    m[col] = [];
    for (let row = 0; row < ROOM_ROWS * ROOM_HEIGHT; row++) {
      m[col][row] = FLOOR;

      // walls
      if (col % ROOM_WIDTH === 0) m[col][row] = WALL;
      if (col % ROOM_WIDTH === ROOM_WIDTH - 1) m[col][row] = WALL;
      if (row % ROOM_HEIGHT === 0) m[col][row] = WALL;
      if (row % ROOM_HEIGHT === ROOM_HEIGHT - 1) m[col][row] = WALL;
    }
  }

  // doors
  // visit the upper left 9 rooms and punch doors left or down
  for (let room_col = 0; room_col < ROOM_COLS; room_col++) {
    for (let room_row = 0; room_row < ROOM_ROWS; room_row++) {
      let direction = random() < 0.5 ? "right" : "down";

      if (room_col === ROOM_COLS - 1) {
        direction = "down";
      }

      if (room_row === ROOM_ROWS - 1) {
        direction = "right";
      }
      if (room_col === ROOM_COLS - 1 && room_row === ROOM_ROWS - 1) {
        direction = "none";
      }
      if (direction === "right") {
        m[room_col * ROOM_WIDTH + ROOM_WIDTH - 1][
          room_row * ROOM_HEIGHT + 3
        ] = FLOOR;
        m[room_col * ROOM_WIDTH + ROOM_WIDTH][
          room_row * ROOM_HEIGHT + 3
        ] = FLOOR;
        m[room_col * ROOM_WIDTH + ROOM_WIDTH - 1][
          room_row * ROOM_HEIGHT + 4
        ] = FLOOR;
        m[room_col * ROOM_WIDTH + ROOM_WIDTH][
          room_row * ROOM_HEIGHT + 4
        ] = FLOOR;
      }

      if (direction === "down") {
        m[room_col * ROOM_WIDTH + 3][
          room_row * ROOM_HEIGHT + ROOM_HEIGHT - 1
        ] = FLOOR;
        m[room_col * ROOM_WIDTH + 3][
          room_row * ROOM_HEIGHT + ROOM_HEIGHT
        ] = FLOOR;
        m[room_col * ROOM_WIDTH + 4][
          room_row * ROOM_HEIGHT + ROOM_HEIGHT - 1
        ] = FLOOR;
        m[room_col * ROOM_WIDTH + 4][
          room_row * ROOM_HEIGHT + ROOM_HEIGHT
        ] = FLOOR;
      }
    }
  }

  return m;
}

function drawMap(m) {
  for (let col = 0; col < ROOM_WIDTH * ROOM_COLS; col++) {
    for (let row = 0; row < ROOM_HEIGHT * ROOM_ROWS; row++) {
      const room_col = floor(col / 8);
      const room_row = floor(row / 8);

      if (!level.visited[room_col][room_row]) continue;
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
  constructor(a, keepShuffled = true) {
    this.a = a;
    this.keepShuffled = keepShuffled;
    if (this.keepShuffled) this.shuffle();
    this.index = 0;
  }

  shuffle() {
    shuffle(this.a, true);
  }

  next() {
    const value = this.a[this.index];
    this.index++;
    if (this.index === this.a.length) {
      if (this.keepShuffled) this.shuffle();
      this.index = 0;
    }
    return value;
  }

  nextUntil(v) {
    while (this.next() !== v) {
      //noop
    }
  }

  remove(v) {
    array_remove(this.a, v);
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

function times(t, f) {
  let a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
