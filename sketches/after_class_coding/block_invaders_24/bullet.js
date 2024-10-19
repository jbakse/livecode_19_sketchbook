import { Enemy } from "./enemy.js";
import { graphics, images, actors } from "./block_invaders_01.js";

export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  step() {
    this.y -= 4;

    // check for collisions
    for (const actor of actors) {
      if (!(actor instanceof Enemy)) continue;

      if (
        this.x < actor.x + 32 &&
        this.x + 16 > actor.x &&
        this.y < actor.y + 32 &&
        this.y + 16 > actor.y
      ) {
        actor.takeHit();
        this.shouldBeRemoved = true;
      }
    }
  }

  draw() {
    graphics.drawImage(images.ghost, [this.x, this.y, 16, 16]);
  }
}
