// module

import { Controls } from "./controls.js";

// Initialize the Controls instance
const controls = new Controls();

// Bind keys to actions
controls.bind("ArrowLeft", "left");
controls.bind("a", "left");
controls.bind("ArrowRight", "right");
controls.bind("d", "right");
controls.bind(" ", "fire");
controls.bind("f", "fire");

// Example game loop using requestAnimationFrame
function gameLoop() {
  // Access the current state of actions using optional chaining
  if (controls.left?.down) {
    // Move left
    console.log("Moving left");
  }

  if (controls.right?.down) {
    // Move right
    console.log("Moving right");
  }

  if (controls.fire?.pressed) {
    // Fire action triggered since last tick
    console.log("Firing!");
  }

  if (controls.fire?.released) {
    // Fire action released since last tick
    console.log("Fire released!");
  }

  // Reset the 'pressed' and 'released' states after processing
  controls.tick();

  // Continue the loop
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Example of unbinding a key after some time (e.g., 10 seconds)
setTimeout(() => {
  controls.unbind("f");
  console.log("Unbound key 'f' from action 'fire'.");
}, 10000);
