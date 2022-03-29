// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

let shared;
let me;
let participants;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "B-M_spaceInvaders_review",
    "main1"
  );
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();
}

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);

  // set up game state
  if (partyIsHost()) {
    partySetShared(shared, {
      enemies: [],
      score: 0,
    });
    // spawn enemies
    for (let i = 0; i < 10; i++) {
      shared.enemies.push({
        x: random(0, width),
        y: 0,
      });
    }
  }

  // set up this player's state
  me.bullets = [];
  me.x = 200;
  me.y = height - 50;
}

function mouseMoved(e) {
  me.x = mouseX;
}

function draw() {
  background(51);

  // host moves enemies
  if (partyIsHost()) {
    for (let enemy of shared.enemies) {
      enemy.y += 0.2;
    }
  }

  // clients move own bullets
  for (const b of me.bullets) {
    b.y -= 10;
  }

  // jb-the lines marked "possible conflict" below are actually
  // "almost certain conflicts" because the host is writing to
  // shared EVERY FRAME to move the enemies down.
  // So "shared" is always busy and trying to write to it from another
  // client will cause a conflict.

  // two approaches to fixing it
  // 1. Keep things pretty close to this, but have the host handle the collisions. In this approach, the host will need to remove bullets from participant shareds, so there could be a conflict if the host removes a bullet at the same time the same participant fires. But that will be realatively rare.
  // 2. Use events to communicate when a bullet is fire or when a bullet is hit, and then have relevant parties do what they need to do to their own shareds. This approach is more complex, but it should eliminate possible conflicts entirely. See Tank Emit example.

  // clients handle collisions between own bullets and enemies
  for (let enemy of shared.enemies) {
    for (let bullet of me.bullets) {
      if (dist(enemy.x, enemy.y, bullet.x, bullet.y) < 10) {
        console.log("hit");
        // remove enemy
        shared.enemies.splice(shared.enemies.indexOf(enemy), 1);
        // ^ possible conflict, every client writes to shared

        // remove bullet
        me.bullets.splice(me.bullets.indexOf(bullet), 1);
        // ^ okay, client writing to own "me"

        // spawn bullet
        shared.enemies.push({
          x: random(0, width),
          y: random(-800, 0),
        });
        //  ^ possible conflict, every client writes to shared

        // increment score
        shared.score++;
        //  ^ possible conflict, every client writes to shared
      }
    }
  }

  // jb: i've separated the drawing and moving code
  // this is generally a good idea, and has the specific benefit here
  // that none of the drawing code below _writes_ to any shared
  // so the drawing code should never cause a conflict

  // draw every participant's bullets
  for (const p of participants) {
    for (const b of p.bullets) {
      circle(b.x, b.y, 10);
    }
  }

  // draw enemies
  for (let enemy of shared.enemies) {
    rect(enemy.x, enemy.y, 10);
  }

  // draw each participant's ship
  for (const p of participants) {
    if (p.x !== undefined && p.y !== undefined) {
      fill("#cc0000");
      ellipse(p.x, p.y, 20, 20);
    }
  }

  // mark this participants ship
  fill("#ffffff");
  ellipse(me.x, me.y, 15, 15);

  // draw score
  text(shared.score, 15, 25);
}

function mousePressed() {
  //spawn a bullet
  me.bullets.push({
    x: mouseX,
    y: height - 50,
  });
}
