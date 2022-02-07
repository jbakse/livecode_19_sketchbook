// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* global partyConnect partyLoadShared partyIsHost*/

/* exported setup draw preload mousePressed  keyPressed*/

let shared;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "ank_nuts_live",
    "main"
  );
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(400, 400);

  if (partyIsHost()) {
    // partySetShared(shared, {
    //   state: "hiding",
    //   locations: [{ x: 0, y: 0 }],
    // });

    // above isn't working right, issue #53

    shared.state = "hiding";
    shared.locations = [];
  }
}

function draw() {
  background("white");
  noStroke();

  if (partyIsHost()) {
    fill("black");
    for (const loc of shared.locations) {
      ellipse(loc.x, loc.y, 10, 10);
    }

    fill("black");
    if (shared.state === "hiding") {
      text("Hide your nuts", 10, 20);
    } else {
      text("They are looking for your nuts", 10, 20);
    }
  }

  if (!partyIsHost()) {
    fill("#ccc");
    for (const loc of shared.locations) {
      ellipse(loc.x, loc.y, 10, 10);
    }

    fill("black");
    if (shared.state === "hiding") {
      text("Nuts are being hidden", 10, 20);
    } else {
      text("Look for the nuts", 10, 20);
    }
  }
}

function mousePressed() {
  if (partyIsHost() && shared.state === "hiding") {
    shared.locations.push({ x: mouseX, y: mouseY });
  }

  if (!partyIsHost() && shared.state === "finding") {
    // look at all the locations
    for (const loc of shared.locations) {
      // if we are close
      if (dist(loc.x, loc.y, mouseX, mouseY) < 30) {
        // remove it
        shared.locations.splice(shared.locations.indexOf(loc), 1);
      }
    }
  }
}

function keyPressed() {
  if (partyIsHost() && keyCode === RETURN) {
    shared.state = shared.state === "hiding" ? "finding" : "hiding";
  }
}

/*
  if (partyIsHost()) {
    partySetShared(shared, {
      locations: [],
    });
    console.log("init");
    console.log(JSON.stringify(shared.locations));
    shared.locations.push({ x: random(width), y: random(height) });
    console.log(JSON.stringify(shared.locations));
    shared.locations.push({ x: random(width), y: random(height) });
    console.log(JSON.stringify(shared.locations));
  }
  */
