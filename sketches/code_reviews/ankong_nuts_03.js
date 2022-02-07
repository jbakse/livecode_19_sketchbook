// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* globals partyConnect partyLoadShared partyIsHost partySetShared*/
/* exported preload setup draw mousePressed*/

const NUT_RADIUS = 30;
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
      nutLocations: [],
    });
  }
}

function draw() {
  background(255);
  fill(0);
  ellipseMode(RADIUS);
  for (const loc of shared.nutLocations) {
    ellipse(loc.x, loc.y, NUT_RADIUS, NUT_RADIUS);
  }
}

function mousePressed() {
  if (partyIsHost()) {
    shared.nutLocations.push({ x: mouseX, y: mouseY });
  }
}
