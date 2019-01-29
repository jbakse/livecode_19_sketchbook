let hay1X = 300;
let hay1Y = 100;
let hay2X = 100;
let hay2Y = 500;
let hay3X = 500;
let hay3Y = 500;
let donkeyX = 300;
let donkeyY = 300;

window.setup = function() {
  createCanvas(600, 600);
  background(50, 50, 50);
};

window.draw = function() {
  for (let i = 0; i < 100; i++) {
    updateSelf();
    drawSelf();
  }
};

function updateSelf() {
  let r = floor(random(3));
  if (r === 0) {
    // move to half way from donkey to hay1
    donkeyX = lerp(donkeyX, hay1X, 0.5);
    donkeyY = lerp(donkeyY, hay1Y, 0.5);
  } else if (r === 1) {
    donkeyX = lerp(donkeyX, hay2X, 0.5);
    donkeyY = lerp(donkeyY, hay2Y, 0.5);
  } else if (r === 2) {
    donkeyX = lerp(donkeyX, hay3X, 0.5);
    donkeyY = lerp(donkeyY, hay3Y, 0.5);
  }
}

function drawSelf() {
  fill("yellow");
  ellipse(hay1X, hay1Y, 10, 10);
  ellipse(hay2X, hay2Y, 10, 10);
  ellipse(hay3X, hay3Y, 10, 10);

  fill("white");
  noStroke();
  ellipse(donkeyX, donkeyY, 1, 1);
}
