// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

/* exported setup draw preload */
/* global partyConnect partyLoadShared  partyIsHost partySetShared partyWatchShared */

let shared;
const shakeAmounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "vtm_dice", "main");
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(488, 48);
  textAlign(CENTER, CENTER);
  textSize(16);
  noiseDetail(1);

  noLoop();

  if (partyIsHost()) {
    partySetShared(shared, {
      hunger: 2,
      diceCount: 5,
      diceValues: [],
    });
  }

  partyWatchShared(shared, "diceValues", shake, true);
  partyWatchShared(shared, draw);

  const rollButton = createButton("roll");
  rollButton.mousePressed(roll);

  const hungerSelect = createSelect();
  hungerSelect.option(0);
  hungerSelect.option(1);
  hungerSelect.option(2);
  hungerSelect.option(3);
  hungerSelect.option(4);
  hungerSelect.option(5);
  hungerSelect.selected(shared.hunger);
  hungerSelect.changed(() => (shared.hunger = hungerSelect.value()));
  partyWatchShared(shared, "hunger", () =>
    hungerSelect.selected(shared.hunger)
  );

  const diceSelect = createSelect();
  diceSelect.option(1);
  diceSelect.option(2);
  diceSelect.option(3);
  diceSelect.option(4);
  diceSelect.option(5);
  diceSelect.option(6);
  diceSelect.option(7);
  diceSelect.option(8);
  diceSelect.option(9);
  diceSelect.option(10);
  diceSelect.option(11);
  diceSelect.option(12);
  diceSelect.selected(shared.diceCount);
  diceSelect.changed(() => (shared.diceCount = diceSelect.value()));
  partyWatchShared(shared, "diceCount", () =>
    diceSelect.selected(shared.diceCount)
  );
}

function roll() {
  for (let i = 0; i < shared.diceCount; i++) {
    shared.diceValues[i] = floor(random(10)) + 1;
  }
  shake();
}

function shake() {
  for (let i = 0; i < shared.diceCount; i++) {
    shakeAmounts[i] = random(5, 10);
  }
  loop();
}

function draw() {
  shakeAmounts.forEach((v, i) => {
    shakeAmounts[i] = max(0, shakeAmounts[i] - 0.25);
  });

  if (shakeAmounts.every((v) => v <= 0)) noLoop();

  background("white");

  drawDice();
}

function drawDice() {
  push();
  noStroke();

  translate(8, 8);
  for (let i = 0; i < shared.diceCount; i++) {
    const s = shakeAmounts[i];
    let v = shared.diceValues[i];
    if (s > 0) {
      v = floor(noise(s * s * 0.1) * 2 * 10) + 1;
    }
    push();
    {
      translate(random(-s, s), random(-s, s));
      translate(16, 16);
      rotate(random(-s, s) * 0.03);
      translate(-16, -16);
      fill("black");
      if (i < shared.hunger) {
        fill("#900");
      }
      rect(0, 0, 32, 32);
      fill("white");
      text(v, 16, 16);
    }
    pop();
    translate(32 + 8, 0);
  }

  pop();
}
