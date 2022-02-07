// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* globals partyConnect partyLoadShared partyIsHost partySetShared*/
/* exported preload setup draw mousePressed keyPressed*/

const NUT_RADIUS = 30; // how close the finder has to click to a nut

let shared;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "ank_nuts_03",
    "main"
  );
  shared = partyLoadShared("food");
}

function setup() {
  createCanvas(400, 400);
  if (partyIsHost()) {
    partySetShared(shared, {
      nutLocations: [], // [{x: 0, y: 0}, ...]
      state: "hiding", // "hiding" or "finding"
    });
  }
}

function draw() {
  background(255);
  noStroke();

  if (partyIsHost()) {
    fill(0);
    drawNuts();

    fill(0);
    if (shared.state === "hiding") {
      text("Hide your nuts", 10, 20);
    } else {
      text("They are looking for your nuts", 10, 20);
    }
  }

  if (!partyIsHost()) {
    fill(0, 50);
    drawNuts();

    fill(0);
    if (shared.state === "hiding") {
      text("Nuts are being hidden", 10, 20);
    } else {
      text("Look for the nuts", 10, 20);
    }
  }
}

function drawNuts() {
  push();
  ellipseMode(RADIUS);
  for (const loc of shared.nutLocations) {
    ellipse(loc.x, loc.y, NUT_RADIUS, NUT_RADIUS);
  }
  pop();
}

function mousePressed() {
  if (partyIsHost() && shared.state === "hiding") {
    shared.nutLocations.push({ x: mouseX, y: mouseY });
  }
  if (!partyIsHost() && shared.state === "finding") {
    // look at every nut
    for (const loc of shared.nutLocations) {
      // if we clicked near it
      if (dist(loc.x, loc.y, mouseX, mouseY) < NUT_RADIUS) {
        // remove it
        shared.nutLocations.splice(shared.nutLocations.indexOf(loc), 1);
        // stop looking
        break;
      }
    }
  }
}

function keyPressed() {
  if (partyIsHost() && keyCode === RETURN) {
    shared.state = shared.state === "hiding" ? "finding" : "hiding";
  }
}

// all writing is in mousePressed and keyPressed
// conflicts can happen if two finders click at once
// conflict can happen if host switches state from finding to hiding right when a finder clicks
// these are unlikely to cause problems
