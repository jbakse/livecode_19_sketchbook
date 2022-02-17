// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/addons/p5.sound.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* global sketch_directory */
/* global partyConnect partyLoadShared partyIsHost partySetShared partyLoadMyShared partyLoadParticipantShareds partySubscribe partyEmit*/
/* global loadSound outputVolume */

/* exported preload setup draw keyPressed mouseReleased*/

/**
 * General Approach
 * Host: moves the traffic, writes a position for each lane to shared{}
 * Players: move themselves, check themselves for collisions, write to my{}
 * Local: copies data from shared{} and participants{} to local state, and draws scene.
 *
 * Accepted Issues
 * its possible (very unlikely) for two clients to join as player1 or player2 at
 * the same time due to race condition
 *
 */

// https://nfggames.com/games/fontmaker/
// http://arcade.photonstorm.com/

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

// assets
const soundLib = {};
const imageLib = {};

// p5.party shared objects
let shared;
let my;
let participants;

// global state
let gameState = "TITLE"; // TITLE, PLAYING

const cars = []; // can this be removed from global scope?

function preload() {
  imageLib.sprites = loadImage(`${sketch_directory}/assets/frogger_sprites.png`);

  imageLib.frogs_f = loadImage(`${sketch_directory}/assets/frogs_f.png`);
  imageLib.frogs_r = loadImage(`${sketch_directory}/assets/frogs_r.png`);
  imageLib.frogs_o = loadImage(`${sketch_directory}/assets/frogs_o.png`);
  imageLib.frogs_g = loadImage(`${sketch_directory}/assets/frogs_g.png`);
  imageLib.frogs_s = loadImage(`${sketch_directory}/assets/frogs_s.png`);

  imageLib.badge_join = loadImage(`${sketch_directory}/assets/badge_join.png`);
  imageLib.badge_p1 = loadImage(`${sketch_directory}/assets/badge_p1.png`);
  imageLib.badge_p2 = loadImage(`${sketch_directory}/assets/badge_p2.png`);
  imageLib.badge_watching = loadImage(`${sketch_directory}/assets/badge_watching.png`);

  imageLib.button_start_up = loadImage(`${sketch_directory}/assets/button_start_up.png`);
  imageLib.button_start_down = loadImage(`${sketch_directory}/assets/button_start_down.png`);

  soundLib.spawn = loadSound(`${sketch_directory}/assets/frogger_sfx_spawn.wav`);
  soundLib.jump = loadSound(`${sketch_directory}/assets/frogger_sfx_jump.wav`);
  soundLib.hit = loadSound(`${sketch_directory}/assets/frogger_sfx_hit.wav`);
  soundLib.die = loadSound(`${sketch_directory}/assets/frogger_sfx_die.wav`);
  soundLib.intro = loadSound(`${sketch_directory}/assets/frogger_sfx_intro.wav`);
  soundLib.title = loadSound(`${sketch_directory}/assets/frogger_sfx_title.wav`);

  partyConnect("wss://deepstream-server-1.herokuapp.com", "frogger", "main");
  shared = partyLoadShared("shared");
  my = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}

function setup() {
  createCanvas(BLOCK_SIZE * 12, BLOCK_SIZE * 13);
  if (partyIsHost()) {
    partySetShared(shared, {
      lanes: [{ pos: 0 }, { pos: 0 }, { pos: 0 }, { pos: 0 }, { pos: 0 }, { pos: 0 }],
    });
  }
  partySetShared(my, {
    role: "observer",
  });
  partySubscribe("playSound", playSound);
  angleMode(DEGREES);
  outputVolume(0.3);
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
  const p1 = participants.find((p) => p.role === "player1");
  const p2 = participants.find((p) => p.role === "player2");

  frogs[0].x = -32; // hide frogs if they are not in the game
  frogs[1].x = -32;

  const syncFrog = (frog, player) => {
    frog.x = player.x;
    frog.y = player.y;
    frog.state = player.state;
    frog.direction = player.direction;
  };
  if (p1) syncFrog(frogs[0], p1);
  if (p2) syncFrog(frogs[1], p2);

  // place traffic
  const createColliders = (lane) => {
    let x = lane.pos;

    while (x < width) {
      // eslint-disable-next-line no-loop-func
      lane.pattern.forEach((item) => {
        if (x + item.length > 0 && item.collides) {
          cars.push({
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
  cars.length = 0;
  lanes.forEach(createColliders);

  // check collisions
  const checkCollisions = (frog) => {
    if (frog.state === "dead") return;
    const collision = !!cars.find((r) => intersectRect(r, insetRect(frog, 4)));
    if (collision) {
      my.state = "dead";
      broadcastSound("hit");
      setTimeout(() => broadcastSound("die"), 300);
      setTimeout(() => watchGame(), 3000);
    }
  };

  if (my.role === "player1") checkCollisions(frogs[0]);
  if (my.role === "player2") checkCollisions(frogs[1]);
}

function draw() {
  if (gameState === "TITLE") drawTitleScreen();

  if (partyIsHost()) stepHost();
  if (gameState === "PLAYING") {
    stepLocal();
    drawGame();
  }
}

function drawTitleScreen() {
  noSmooth();
  noStroke();
  background("#333");

  // draw title
  const frogs_letters = [
    imageLib.frogs_f,
    imageLib.frogs_r,
    imageLib.frogs_o,
    imageLib.frogs_g,
    imageLib.frogs_s,
  ];

  push();
  translate(1 * 32, 96);
  frogs_letters.forEach((img, i) => {
    const h = 16; // jump height
    const f = 1; // jumps per second
    const s = 8; // amount to stagger jumps
    const y = max(sin(((-frameCount + i * s) / 60) * 360 * f), 0) * -h;
    image(img, i * 64, y, 64, 64);
  });
  pop();

  // draw start button
  push();
  if (mouseIsPressed) {
    image(imageLib.button_start_down, 3.5 * 32, 8 * 32, 160, 64);
  } else {
    image(imageLib.button_start_up, 3.5 * 32, 8 * 32, 160, 64);
  }
  pop();
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

  drawBadge();
}

function drawBadge() {
  push();
  let i = imageLib.badge_watching;
  if (
    !participants.find((p) => p.role === "player1") ||
    !participants.find((p) => p.role === "player2")
  ) {
    i = imageLib.badge_join;
  }
  if (my.role === "player1") i = imageLib.badge_p1;
  if (my.role === "player2") i = imageLib.badge_p2;
  image(i, (width - i.width) * 0.5, height - i.height * 1.5);
  pop();
}

function drawTraffic() {
  push();
  cars.forEach((r) => {
    image(imageLib.sprites, r.x, r.y + 4, r.w, r.h - 8, r.sprite * 8, 0, r.w / 3, 8);
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
  image(imageLib.sprites, -12, -12, 24, 24, 10 * 8, 0, 8, 8);
  pop();
}

function drawDeadFrog(frog) {
  push();
  translate(frog.x + 16, frog.y + 16);
  tint(frog.color);
  image(imageLib.sprites, -12, -12, 24, 24, 11 * 8, 0, 8, 8);
  tint("red");
  image(imageLib.sprites, -12, -12, 24, 24, 12 * 8, 0, 8, 8);
  pop();
}

function drawBackground() {
  push();
  // grass
  fill("#030");
  noStroke();
  rect(0, BLOCK_SIZE * 0, width, BLOCK_SIZE * 2);

  // shoulder
  fill("#555");
  noStroke();
  rect(0, BLOCK_SIZE * 2, width, BLOCK_SIZE * 1);

  // road
  fill("#222");
  noStroke();
  rect(0, BLOCK_SIZE * 3, width, BLOCK_SIZE * 6);

  // road markings
  noFill();
  stroke("white");
  strokeWeight(3);
  line(0, BLOCK_SIZE * 3 + 1.5, width, BLOCK_SIZE * 3 + 1.5);
  line(0, BLOCK_SIZE * 9 - 1.5, width, BLOCK_SIZE * 9 - 1.5);

  // shoulder
  fill("#555");
  noStroke();
  rect(0, BLOCK_SIZE * 9, width, BLOCK_SIZE * 1);

  // grass
  fill("#030");
  noStroke();
  rect(0, BLOCK_SIZE * 10, width, BLOCK_SIZE * 3);

  // fill("black");
  // rect(0, BLOCK_SIZE * 12, width, BLOCK_SIZE * 1);

  pop();
}

function keyPressed() {
  // try to join if not a player
  if (my.role !== "player1" && my.role !== "player2") {
    joinGame();
    return;
  }

  // reject input if dead
  if (my.state === "dead") return;

  if (keyCode === LEFT_ARROW || keyCode === 65) move(-BLOCK_SIZE, 0); // left
  if (keyCode === RIGHT_ARROW || keyCode === 68) move(BLOCK_SIZE, 0); // right
  if (keyCode === UP_ARROW || keyCode === 87) move(0, -BLOCK_SIZE); // up
  if (keyCode === DOWN_ARROW || keyCode === 83) move(0, BLOCK_SIZE); // down
}

function mouseReleased() {
  if (gameState === "TITLE") {
    soundLib.intro.play();
    gameState = "PLAYING";
  }
}

function move(x, y) {
  // constrain frog to play area
  const targetLocation = { x: my.x + x, y: my.y + y };
  const bounds = { x: 0, y: 0, w: width - 32, h: height - 32 };
  if (!pointInRect(targetLocation, bounds)) {
    soundLib.hit.play();
    return;
  }

  // move frog
  my.x += x;
  my.y += y;

  // face frog in direction of movement
  if (x < 0) my.direction = "left";
  if (x > 0) my.direction = "right";
  if (y < 0) my.direction = "up";
  if (y > 0) my.direction = "down";

  broadcastSound("jump");
}

function joinGame() {
  // don't let current players double join
  if (my.role === "player1" || my.role === "player2") return;

  if (!participants.find((p) => p.role === "player1")) {
    spawn(frogs[0]);
    my.role = "player1";
    return;
  }
  if (!participants.find((p) => p.role === "player2")) {
    spawn(frogs[1]);
    my.role = "player2";
    return;
  }
}

function watchGame() {
  my.role = "observer";
}

function spawn(frog) {
  my.x = frog.spawnX;
  my.y = frog.spawnY;
  my.direction = "up";
  my.state = "alive";
  broadcastSound("spawn");
}

function intersectRect(r1, r2) {
  return !(
    r2.x > r1.x + r1.w || // format wrapped
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

function broadcastSound(name) {
  partyEmit("playSound", name);
}

function playSound(name) {
  soundLib[name].play();
}

// function mod(a, b) {
//   return ((a % b) + b) % b;
// }

function pointInRect(p, r) {
  return (
    p.x >= r.x && // format wrapped
    p.x <= r.x + r.w &&
    p.y >= r.y &&
    p.y <= r.y + r.h
  );
}
