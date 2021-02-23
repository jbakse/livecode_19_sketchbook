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

class InputManager {
  constructor() {
    this.is_down = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    this.down_count = {
      left: 0,
      right: 0,
      up: 0,
      down: 0,
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.is_down.left = true;
      if (e.key === "ArrowRight") this.is_down.right = true;
      if (e.key === "ArrowUp") this.is_down.up = true;
      if (e.key === "ArrowDown") this.is_down.down = true;
      if (e.key === "a") this.is_down.left = true;
      if (e.key === "d") this.is_down.right = true;
      if (e.key === "w") this.is_down.up = true;
      if (e.key === "s") this.is_down.down = true;
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") this.is_down.left = false;
      if (e.key === "ArrowRight") this.is_down.right = false;
      if (e.key === "ArrowUp") this.is_down.up = false;
      if (e.key === "ArrowDown") this.is_down.down = false;
      if (e.key === "a") this.is_down.left = false;
      if (e.key === "d") this.is_down.right = false;
      if (e.key === "w") this.is_down.up = false;
      if (e.key === "s") this.is_down.down = false;
    });
  }
  step() {
    if (!this.is_down.left) this.down_count.left = 0;
    if (!this.is_down.right) this.down_count.right = 0;
    if (!this.is_down.up) this.down_count.up = 0;
    if (!this.is_down.down) this.down_count.down = 0;

    if (this.is_down.left) this.down_count.left++;
    if (this.is_down.right) this.down_count.right++;
    if (this.is_down.up) this.down_count.up++;
    if (this.is_down.down) this.down_count.down++;
  }
  button(button) {
    return !!this.is_down[button];
  }
  buttonDown(button, rate = 10) {
    return this.down_count[button] % rate === 1;
  }
}

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
  createCanvas(512, 528);
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
    if (level.visited[floor(sprite.col / 8)][floor(sprite.row / 8)]) {
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
  level.visited[0] = [];
  level.visited[1] = [];
  level.visited[2] = [];
  level.visited[3] = [];

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

function drawMap(m) {
  for (let col = 0; col < 32; col++) {
    for (let row = 0; row < 32; row++) {
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
