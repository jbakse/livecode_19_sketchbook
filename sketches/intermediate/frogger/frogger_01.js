// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* global partyConnect partyLoadShared partyIsHost partySetShared partyLoadMyShared partyLoadParticipantShareds */
/* exported preload setup draw keyPressed*/

const truck = 4;
const car = 2;
const small_gap = 4;
const large_gap = 8;
const lanes = [
  { pos: 0, speed: 1, pattern: [truck, large_gap] },
  { pos: 0, speed: 2, pattern: [car, small_gap, car, large_gap] },
  { pos: 0, speed: 1, pattern: [truck, large_gap, car, large_gap] },
  {
    pos: 0,
    speed: 2,
    pattern: [car, small_gap, car, small_gap, car, large_gap],
  },
  { pos: 0, speed: 1, pattern: [car, large_gap, car, large_gap] },
];

const frogs = [
  {
    x: 0,
    y: 0,
    goalX: 0,
    goalY: 0,
    w: 32,
    h: 32,
    color: "green",
  },
  {
    x: 0,
    y: 0,
    goalX: 0,
    goalY: 0,
    w: 32,
    h: 32,
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
  // todo maybe redo this so that it only syncs lanes periodically (every 200ms or something)
  shared.lanes.forEach((sharedLane, i) => {
    const localLane = lanes[i];
    sharedLane.pos -= localLane.speed;
  });
}

function step() {
  assignPlayers();

  shared.lanes.forEach((sharedLane, i) => {
    const localLane = lanes[i];
    localLane.pos = sharedLane.pos;
  });

  // place traffic
  collisionRects.length = 0;
  lanes.forEach(createColliders);
  collisionRects.forEach((r) => {
    r.y += 128 + 16;
  });

  // check collisions
  collisionRects.forEach((r) => {
    frogs.forEach((f) => {
      if (intersectRect(f, r)) {
        if (f.state === "dead") return;
        f.state = "dead";
        setTimeout(() => {
          f.state = "alive";
          if (f === frogs[0]) {
            const p1 = participants.find((p) => p.role === "player1");

            p1.x = 256;
            p1.y = 480;
          }
          if (f === frogs[1]) {
            const p1 = participants.find((p) => p.role === "player2");
            p1.x = 256;
            p1.y = 480;
          }
        }, 2000);
      }
    });
  });

  // move frogs
  const p1 = participants.find((p) => p.role === "player1");
  if (p1 && frogs[0].state !== "dead") {
    const far = dist(frogs[0].goalX, frogs[0].goalY, p1.x, p1.y) > 128;
    frogs[0].goalX = p1.x;
    frogs[0].goalY = p1.y;
    frogs[0].x = far ? frogs[0].goalX : lerp(frogs[0].x, frogs[0].goalX, 0.2);
    frogs[0].y = far ? frogs[0].goalY : lerp(frogs[0].y, frogs[0].goalY, 0.2);
  }

  const p2 = participants.find((p) => p.role === "player2");
  if (p2 && frogs[1].state !== "dead") {
    const far = dist(frogs[1].goalX, frogs[1].goalY, p2.x, p2.y) > 128;
    frogs[1].goalX = p2.x;
    frogs[1].goalY = p2.y;
    frogs[1].x = far ? frogs[1].goalX : lerp(frogs[1].x, frogs[1].goalX, 0.2);
    frogs[1].y = far ? frogs[1].goalY : lerp(frogs[1].y, frogs[1].goalY, 0.2);
  }
}

function draw() {
  if (partyIsHost()) stepHost();
  step();

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

function moveLane(lane) {
  lane.pos -= lane.speed;
}

function createColliders(lane, laneNumber) {
  const y = laneNumber * 48;
  let x = lane.pos;
  while (x < width) {
    for (let i = 0; i < lane.pattern.length; i += 2) {
      collisionRects.push({ x, y, w: lane.pattern[i] * 32, h: 32 });
      x += (lane.pattern[i] + lane.pattern[i + 1]) * 32;
    }
  }
}

function keyPressed() {
  console.log(frogs);
  // reject input if not a player
  if (my.role !== "player1" && my.role !== "player2") return;

  console.log(my.role, keyCode);
  if (keyCode === LEFT_ARROW || keyCode === 65) my.x -= 48; // a
  if (keyCode === RIGHT_ARROW || keyCode === 68) my.x += 48; // d
  if (keyCode === UP_ARROW || keyCode === 87) my.y -= 48; // w
  if (keyCode === DOWN_ARROW || keyCode === 83) my.y += 48; // s
}

// called from draw each player checks if player1 or 2 role is open
// and takes it if currently first inline
function assignPlayers() {
  if (!participants.find((p) => p.role === "player1")) {
    const o = participants.find((p) => p.role === "observer");
    if (o === my) {
      my.x = 480;
      my.y = 480;
      my.role = "player1";
    }
  }
  if (!participants.find((p) => p.role === "player2")) {
    const o = participants.find((p) => p.role === "observer");
    if (o === my) {
      my.x = 0;
      my.y = 480;
      my.role = "player2";
    }
  }
}

function intersectRect(r1, r2) {
  return !(
    r2.x > r1.x + r1.w ||
    r2.x + r2.w < r1.x ||
    r2.y > r1.y + r1.h ||
    r2.y + r2.h < r1.y
  );
}
