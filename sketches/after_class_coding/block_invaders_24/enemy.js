import { graphics, images } from "./block_invaders_01.js";

import { player } from "./block_invaders_01.js";

import { AutoWeapon, Weapon } from "./player.js";

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  takeHit() {
    this.shouldBeRemoved = true;
  }
  step() {
    this.y += 2;

    if (this.y > 1024) {
      this.y = 0;
    }
  }

  draw() {
    graphics.drawImage(images.ghost, [this.x, this.y, 32, 32], { tint: "red" });
  }
}

export class FastEnemy extends Enemy {
  step() {
    this.y += 2;

    super.step();
  }

  takeHit() {
    this.shouldBeRemoved = true;
    player.weapon = new AutoWeapon(player);
    setTimeout(() => {
      player.weapon = new Weapon(player);
    }, 3000);
  }
}
