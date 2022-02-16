// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* global partyConnect partyLoadShared partyIsHost partySetShared partyLoadMyShared partyLoadParticipantShareds */
/* exported preload setup draw keyPressed*/

/**
 * General Approach
 * Host: moves the traffic, writes a position for each lane to shared{}
 * Players: move themselves, check themselves for collisions, write to my{}
 * Local: copies data from shared{} and participants{} to local state, and draws scene.
 */

const truck = 4;
const car = 2;
const small_gap = 4;
const large_gap = 8;
const lanes = [
  {
    pos: 0, //
    y: 144 + 48 * 0,
    speed: 1.5,
    pattern: [truck, large_gap],
  },
  {
    pos: 0, //
    y: 144 + 48 * 1,
    speed: 2,
    pattern: [car, small_gap, car, large_gap],
  },
  {
    pos: 0, //
    y: 144 + 48 * 2,
    speed: 0.5,
    pattern: [truck, large_gap, car, large_gap],
  },
  {
    pos: 0,
    y: 144 + 48 * 3,
    speed: 2.5,
    pattern: [car, small_gap, car, small_gap, car, large_gap],
  },
  {
    pos: 0, //
    y: 144 + 48 * 4,
    speed: 1,
    pattern: [car, large_gap, car, large_gap],
  },
];

const frogs = [
  {
    x: 0,
    y: 0,
    w: 32,
    h: 32,
    spawnX: 0,
    spawnY: 480,
    color: "green",
  },
  {
    x: 0,
    y: 0,
    w: 32,
    h: 32,
    spawnX: 480,
    spawnY: 480,
    color: "yellow",
  },
];

const collisionRects = [];

let shared;
let my;
let participants;

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "frogger", "main");
  shared = partyLoadShared("shared");
  my = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}
function setup() {
  createCanvas(512, 512);
  if (partyIsHost()) {
    partySetShared(shared, {
      lanes: [{ pos: 0 }, { pos: 0 }, { pos: 0 }, { pos: 0 }, { pos: 0 }],
    });
  }
  partySetShared(my, {
    role: "observer",
  });
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
  };
  const p1 = participants.find((p) => p.role === "player1");
  if (p1) syncFrog(frogs[0], p1);
  const p2 = participants.find((p) => p.role === "player2");
  if (p2) syncFrog(frogs[1], p2);

  // place traffic
  const createColliders = (lane) => {
    let x = lane.pos;
    while (x < width) {
      for (let i = 0; i < lane.pattern.length; i += 2) {
        if (x + lane.pattern[i] * 32 > 0) {
          collisionRects.push({ x, y: lane.y, w: lane.pattern[i] * 32, h: 32 });
        }
        x += (lane.pattern[i] + lane.pattern[i + 1]) * 32;
      }
    }
  };
  collisionRects.length = 0;
  lanes.forEach(createColliders);

  // check collisions
  const checkCollisions = (frog) => {
    if (frog.state === "dead") return;
    const collision = !!collisionRects.find((r) => intersectRect(r, frog));
    if (collision) {
      my.state = "dead";
      setTimeout(() => spawn(frog), 1000);
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
  background("black");

  // draw frogs
  frogs.forEach((frog) => {
    if (frog.state === "dead") {
      fill("red");
      ellipseMode(CORNER);
      ellipse(frog.x, frog.y, 32, 32);
    } else {
      fill(frog.color);
      rect(frog.x, frog.y, 32, 32);
    }
  });

  // draw traffic
  noStroke();
  fill("#ccf");
  collisionRects.forEach((r) => {
    rect(r.x, r.y, r.w, r.h);
  });
}

function keyPressed() {
  // reject input if not a player
  if (my.role !== "player1" && my.role !== "player2") return;

  // reject input if dead
  if (my.state === "dead") return;

  if (keyCode === LEFT_ARROW || keyCode === 65) my.x -= 48; // a
  if (keyCode === RIGHT_ARROW || keyCode === 68) my.x += 48; // d
  if (keyCode === UP_ARROW || keyCode === 87) my.y -= 48; // w
  if (keyCode === DOWN_ARROW || keyCode === 83) my.y += 48; // s
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
  my.state = "alive";
}

function intersectRect(r1, r2) {
  return !(
    r2.x > r1.x + r1.w ||
    r2.x + r2.w < r1.x ||
    r2.y > r1.y + r1.h ||
    r2.y + r2.h < r1.y
  );
}

// function mod(a, b) {
//   return ((a % b) + b) % b;
// }
