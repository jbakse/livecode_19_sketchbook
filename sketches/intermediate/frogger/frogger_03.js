// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/addons/p5.sound.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* global sketch_directory */

/* global partyConnect partyLoadShared partyIsHost partySetShared partyLoadMyShared partyLoadParticipantShareds */

/* global loadSound */

/* exported preload setup draw keyPressed*/

/**
 * General Approach
 * Host: moves the traffic, writes a position for each lane to shared{}
 * Players: move themselves, check themselves for collisions, write to my{}
 * Local: copies data from shared{} and participants{} to local state, and draws scene.
 */

const BLOCK_SIZE = 32;
const SPRITE_SIZE = 24;

const truck = { sprite: 4, collides: true, length: 4 * SPRITE_SIZE };
const car = { sprite: 2, collides: true, length: 2 * SPRITE_SIZE };
const small_gap = { sprite: false, collides: false, length: 4 * SPRITE_SIZE };
const large_gap = { sprite: false, collides: false, length: 8 * SPRITE_SIZE };

const lanes = [
  {
    pos: 0,
    y: BLOCK_SIZE * 3,
    speed: 1.5,
    pattern: [truck, large_gap],
  },
  {
    pos: 0,
    y: BLOCK_SIZE * 4,
    speed: 2,
    pattern: [car, small_gap, car, large_gap],
  },
  {
    pos: 0,
    y: BLOCK_SIZE * 5,
    speed: 0.5,
    pattern: [truck, large_gap, car, large_gap],
  },
  {
    pos: 0,
    y: BLOCK_SIZE * 6,
    speed: 2.5,
    pattern: [car, small_gap, car, small_gap, car, large_gap],
  },
  {
    pos: 0,
    y: BLOCK_SIZE * 7,
    speed: 1,
    pattern: [car, large_gap, car, large_gap],
  },
  {
    pos: 0,
    y: BLOCK_SIZE * 8,
    speed: 1.5,
    pattern: [car, large_gap, car, large_gap],
  },
];

const frogs = [
  {
    x: -32,
    y: 0,
    w: BLOCK_SIZE,
    h: BLOCK_SIZE,
    spawnX: 2 * BLOCK_SIZE,
    spawnY: 11 * BLOCK_SIZE,
    color: "#6f6",
  },
  {
    x: -32,
    y: 0,
    w: BLOCK_SIZE,
    h: BLOCK_SIZE,
    spawnX: 9 * BLOCK_SIZE,
    spawnY: 11 * BLOCK_SIZE,
    color: "#ff6",
  },
];

const collisionRects = [];

const sounds = {};
let spriteSheet;

let shared;
let my;
let participants;

function preload() {
  spriteSheet = loadImage(`${sketch_directory}/assets/frogger_sprites.png`);
  sounds.spawn = loadSound(`${sketch_directory}/assets/frogger_sfx_spawn.wav`);
  sounds.jump = loadSound(`${sketch_directory}/assets/frogger_sfx_jump.wav`);
  sounds.hit = loadSound(`${sketch_directory}/assets/frogger_sfx_hit.wav`);
  sounds.die = loadSound(`${sketch_directory}/assets/frogger_sfx_die.wav`);
  sounds.intro = loadSound(`${sketch_directory}/assets/frogger_sfx_intro.wav`);
  sounds.title = loadSound(`${sketch_directory}/assets/frogger_sfx_title.wav`);

  partyConnect("wss://deepstream-server-1.herokuapp.com", "frogger", "main");
  shared = partyLoadShared("shared");
  my = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}

function setup() {
  createCanvas(BLOCK_SIZE * 12, BLOCK_SIZE * 12);
  if (partyIsHost()) {
    partySetShared(shared, {
      lanes: [
        { pos: 0 },
        { pos: 0 },
        { pos: 0 },
        { pos: 0 },
        { pos: 0 },
        { pos: 0 },
      ],
    });
  }
  partySetShared(my, {
    role: "observer",
  });

  angleMode(DEGREES);
}

function stepHost() {
  // move traffic
  shared.lanes.forEach((sharedLane, i) => {
    const localLane = lanes[i];
    sharedLane.pos -= localLane.speed;
  });
}

function stepLocal() {
  // sync traffic from shared to local
  shared.lanes.forEach((sharedLane, i) => {
    const localLane = lanes[i];
    localLane.pos = sharedLane.pos;
  });

  // sync frog positions from shared to local
  const syncFrog = (frog, player) => {
    frog.x = player.x;
    frog.y = player.y;
    frog.state = player.state;
    frog.direction = player.direction;
  };
  const p1 = participants.find((p) => p.role === "player1");
  if (p1) syncFrog(frogs[0], p1);
  const p2 = participants.find((p) => p.role === "player2");
  if (p2) syncFrog(frogs[1], p2);

  // place traffic
  const createColliders = (lane) => {
    let x = lane.pos;

    while (x < width) {
      // eslint-disable-next-line no-loop-func
      lane.pattern.forEach((item) => {
        if (x + item.length > 0 && item.collides) {
          collisionRects.push({
            x,
            y: lane.y,
            w: item.length,
            h: BLOCK_SIZE,
            sprite: item.sprite,
          });
        }
        x += item.length;
      });
    }
  };
  collisionRects.length = 0;
  lanes.forEach(createColliders);

  // check collisions
  const checkCollisions = (frog) => {
    if (frog.state === "dead") return;
    const collision = !!collisionRects.find((r) =>
      intersectRect(r, insetRect(frog, 4))
    );
    if (collision) {
      my.state = "dead";
      sounds.hit.play();
      setTimeout(() => sounds.die.play(), 300);
      setTimeout(() => spawn(frog), 3000);
    }
  };

  if (my.role === "player1") checkCollisions(frogs[0]);
  if (my.role === "player2") checkCollisions(frogs[1]);
}

function draw() {
  assignPlayers();
  if (partyIsHost()) stepHost();
  stepLocal();

  drawGame();
}

function drawGame() {
  noSmooth();

  drawBackground();

  frogs.forEach((frog) => {
    if (frog.state === "dead") {
      drawDeadFrog(frog);
    } else {
      drawFrog(frog);
    }
  });

  drawTraffic();
}

function drawTraffic() {
  push();
  collisionRects.forEach((r) => {
    image(spriteSheet, r.x, r.y + 4, r.w, r.h - 8, r.sprite * 8, 0, r.w / 3, 8);
  });
  pop();
}

function drawFrog(frog) {
  push();
  translate(frog.x + 16, frog.y + 16);
  if (frog.direction === "left") rotate(-90);
  if (frog.direction === "right") rotate(90);
  if (frog.direction === "down") rotate(180);
  tint(frog.color);
  image(spriteSheet, -12, -12, 24, 24, 10 * 8, 0, 8, 8);
  pop();
}

function drawDeadFrog(frog) {
  push();
  translate(frog.x + 16, frog.y + 16);
  tint(frog.color);
  image(spriteSheet, -12, -12, 24, 24, 11 * 8, 0, 8, 8);
  tint("red");
  image(spriteSheet, -12, -12, 24, 24, 12 * 8, 0, 8, 8);
  pop();
}

function drawBackground() {
  push();
  // grass
  fill("#030");
  noStroke();
  rect(0, BLOCK_SIZE * 0, width, BLOCK_SIZE * 2);

  // shoulder
  fill("gray");
  noStroke();
  rect(0, BLOCK_SIZE * 2, width, BLOCK_SIZE * 1);

  // road
  fill("black");
  noStroke();
  rect(0, BLOCK_SIZE * 3, width, BLOCK_SIZE * 6);

  // road markings
  noFill();
  stroke("white");
  strokeWeight(3);
  line(0, BLOCK_SIZE * 3 + 1.5, width, BLOCK_SIZE * 3 + 1.5);
  line(0, BLOCK_SIZE * 9 - 1.5, width, BLOCK_SIZE * 9 - 1.5);

  // shoulder
  fill("gray");
  noStroke();
  rect(0, BLOCK_SIZE * 9, width, BLOCK_SIZE * 1);

  // grass
  fill("#030");
  noStroke();
  rect(0, BLOCK_SIZE * 10, width, BLOCK_SIZE * 2);
  pop();
}

function keyPressed() {
  // reject input if not a player
  if (my.role !== "player1" && my.role !== "player2") return;

  // reject input if dead
  if (my.state === "dead") return;

  if (keyCode === LEFT_ARROW || keyCode === 65) move(-BLOCK_SIZE, 0); // left
  if (keyCode === RIGHT_ARROW || keyCode === 68) move(BLOCK_SIZE, 0); // right
  if (keyCode === UP_ARROW || keyCode === 87) move(0, -BLOCK_SIZE); // up
  if (keyCode === DOWN_ARROW || keyCode === 83) move(0, BLOCK_SIZE); // down
}

function move(x, y) {
  my.x += x;
  my.y += y;
  if (x < 0) my.direction = "left";
  if (x > 0) my.direction = "right";
  if (y < 0) my.direction = "up";
  if (y > 0) my.direction = "down";
  sounds.jump.play();
}

function assignPlayers() {
  if (!participants.find((p) => p.role === "player1")) {
    const o = participants.find((p) => p.role === "observer");
    if (o === my) {
      spawn(frogs[0]);
      my.role = "player1";
    }
  }
  if (!participants.find((p) => p.role === "player2")) {
    const o = participants.find((p) => p.role === "observer");
    if (o === my) {
      spawn(frogs[1]);
      my.role = "player2";
    }
  }
}

function spawn(frog) {
  my.x = frog.spawnX;
  my.y = frog.spawnY;
  my.direction = "up";
  my.state = "alive";
  sounds.spawn.play();
}

function intersectRect(r1, r2) {
  return !(
    r2.x > r1.x + r1.w ||
    r2.x + r2.w < r1.x ||
    r2.y > r1.y + r1.h ||
    r2.y + r2.h < r1.y
  );
}

function insetRect(r, amount) {
  const o = {};
  o.x = r.x + amount;
  o.y = r.y + amount;
  o.w = r.w - amount * 2;
  o.h = r.h - amount * 2;
  return o;
}

// function mod(a, b) {
//   return ((a % b) + b) % b;
// }
