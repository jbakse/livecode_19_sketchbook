// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js
/* eslint-disable */

//Host hid food at certain location
//After the host is done, the other player go find the food

let shared;
let nuts;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "Ank_week2_2",
    "main5"
  );
  shared = partyLoadShared("food");
  host = partyLoadShared("host");
  participants = partyLoadShared("parts");

  nuts = loadImage("nut.png");
}

function setup() {
  createCanvas(400, 400);
  host.food_r = 30;
  shared.next = false;

  if (partyIsHost()) {
    host.foodLoc = [];
  }

  if (!partyIsHost()) {
    participants.Loc = [];
  }

  host.foodLoc = host.foodLoc || [];
  frameRate(100);
}

function draw() {
  background(255);

  if (partyIsHost()) {
    for (const f of host.foodLoc) {
      fill(0);
      image(nuts, f.x, f.y, host.food_r, host.food_r);
    }
  }

  if (!partyIsHost()) {
    if (shared.next == true) {
      text("Now, find nuts your friend hide", 200, 200);

      for (const f of host.foodLoc) {
        if (
          f.x < participants.Loc[0] < f.x + host.food_r &&
          f.y < participants.Loc[1] < f.y + host.food_r
        ) {
          host.foodLoc.splice(f, 1);
          console.log(host.foodLoc, participants.Loc);
        }
      }
    }
    text("Hidden Nuts: " + host.foodLoc.length, 200, 250);

    if (shared.next == false) {
      text("Please wait for your friend", 200, 200);
    }
    console.log(host.foodLoc);
  }
  next();
}

// function collect(f){
//   console.log(f)
//   host.foodLoc, f, 1);
//   //host.foodLoc.splice(f,1)

// }

function mousePressed(e) {
  if (partyIsHost() && !next()) {
    host.x = mouseX;
    host.y = mouseY;
    if (0 < host.x && host.x < 400 && 0 < host.y && host.y < 400) {
      host.foodLoc.push({ x: host.x, y: host.y });
    }
  }

  if (!partyIsHost()) {
    //participants.y = mouseY
    //participants.x = mouseX
    participants.Loc = [];
    participants.Loc.push(mouseX);
    participants.Loc.push(mouseY);

    console.log(participants);
  }
}

function next() {
  if (partyIsHost()) {
    if (keyCode == ENTER) {
      shared.next = true;
      return true;
    }
  }
}
