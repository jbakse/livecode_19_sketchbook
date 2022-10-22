// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* exported setup draw mousePressed*/

// gameState - holds the currently active game state object
//
// game state objects have the following methods:
// enter - called when the game state is entered (optional)
// update - called every frame, game logic, no drawing
// draw - called every frame, should draw the scene, no game logic
// mousePressed - called when the mouse is pressed (optional)
// leave - called when the game state is left (optional)

let gameState;
const gameStates = {};

function setup() {
  createCanvas(512, 512);
  angleMode(DEGREES);
  setGameState(gameStates.play);
}

function draw() {
  gameState.update();
  gameState.draw();
}

function mousePressed() {
  if (gameState.mousePressed) gameState.mousePressed();
}

function setGameState(newState) {
  if (!newState || !newState.update || !newState.draw) {
    console.error("newState not provided");
    return;
  }
  if (gameState?.leave) gameState.leave();
  gameState = newState;
  if (gameState.enter) gameState.enter();
}

gameStates.title = {
  rotation: 0, // rotation of the title text
  enter() {
    this.rotation = 0;
  },
  update() {
    this.rotation += 1;
  },
  draw() {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    translate(width / 2, height / 2);
    rotate(this.rotation);
    text("Title Screen", 0, 0);
  },
  mousePressed() {
    setGameState(gameStates.play);
  },
  leave() {
    // nothing
  },
};

gameStates.play = {
  wobble: 0, // tracks the wobble of the text
  enter() {
    this.wobble = 0;
  },
  update() {
    this.wobble += 1;
  },
  draw() {
    background("#060");
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    translate(width / 2, height / 2);
    rotate(sin(this.wobble * 10) * 20);
    text("Game Screen", 0, 0);
  },
  mousePressed() {
    setGameState(gameStates.title);
  },
  leave() {
    // nothing
  },
};
