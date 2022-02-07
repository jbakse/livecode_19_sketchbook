// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js
/* eslint-disable */

// names should describe the purpose of the variable
// they should be longer, more complete when they have bigger scope
// globals and shared object properties should probably have very complete names then
// functions should have verb names
// arrays should be plural nouns
// objects, numbers, strings should be singular nouns

let shared;
let nuts; // name should be singular, maybe nuts_image

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "ank_nuts", "main");

  shared = partyLoadShared("food");

  // should declare host as global
  host = partyLoadShared("host");
  // sould declare participants as global
  participants = partyLoadShared("parts");

  // i'm not sure you need host or participants, it seems like you
  // made these without a concrete plan or need

  nuts = loadImage("nut.png");
}

function setup() {
  createCanvas(400, 400);
  host.food_r = 30; // food_r is too short, unclear. food_radius would be better
  // food_r never changes. so it can be a global constant, unshared

  shared.next = false; // next is unclear. maybe state = "hiding" | "finding"
  // shared.next is only written by host, so _if_ you do have a host shared object, probably .next should be on _it_

  // the two assignments above happen anytime any client joins. do you want this to happen only when its the host? or not?

  if (partyIsHost()) {
    // proably good to use partySetShared here, its more complete, the examples should probably switch to this too
    host.foodLoc = [];
  }

  if (!partyIsHost()) {
    // participants is an _array_ of shared objects.
    // you have set a property on that array, which is weird!
    // also, it won't be shared.
    // also it shouldn't start with a capial letter.
    participants.Loc = [];
  }

  // you already initialized host.foodLoc above!
  host.foodLoc = host.foodLoc || [];

  // you should probably just use 60, which is the default.
  frameRate(100);
}

function draw() {
  background(255);

  // I'm thinking about this one.
  // Many of you have been using "host" as something user facing.
  // I didn't intend that. And the host is automatically determined
  // by p5 party, which might not be what you'd want.
  // But the way some of yo have been using it makes sense, especially
  // for a quick demo or prototype...

  if (partyIsHost()) {
    // fill is probably better here, and you might want to wrap this in push() pop()
    for (const f of host.foodLoc) {
      fill(0);
      image(nuts, f.x, f.y, host.food_r, host.food_r);
    }
  }

  if (!partyIsHost()) {
    if (shared.next == true) {
      text("Now, find nuts your friend hide", 200, 200);

      // this whole bit can be moved into the mousePressed
      // you are stashing the mouseX/Y in participants.Loc then checking
      // here, thats just extra steps.
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

    // probably put this above the other if, so they are "in order"
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
  // whoa! you don't mean to run the next() function here!
  // you wanted to check shared.next
  if (partyIsHost() && !next()) {
    // you set host.x and host.y here
    host.x = mouseX;
    host.y = mouseY;
    // and then check them right here
    // you never reference them anywhere else, you don't need them at all.
    if (0 < host.x && host.x < 400 && 0 < host.y && host.y < 400) {
      host.foodLoc.push({ x: host.x, y: host.y });
    }
  }

  // you need to check the game state here.
  if (!partyIsHost()) {
    //participants.y = mouseY
    //participants.x = mouseX
    participants.Loc = [];
    participants.Loc.push(mouseX);
    participants.Loc.push(mouseY);

    console.log(participants);
  }
}

// this function can just be a keyPressed
// https://p5js.org/reference/#/p5/keyPressed
// if you did need this function, it should probably be named something like
// "checkKeys"
// functions should have verb names

function next() {
  if (partyIsHost()) {
    if (keyCode == ENTER) {
      shared.next = true;
      return true;
    }
  }
}
