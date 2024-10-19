import { Bullet } from "./bullet.js";
import { graphics, images, controls, actors } from "./block_invaders_01.js";

export class Player {
  constructor() {
    this.x = 512;
    this.y = 960;
  }

  step() {
    if (controls.left.down) {
      this.x -= 4;
    }
    if (controls.right.down) {
      this.x += 4;
    }
    if (controls.fire.pressed) {
      actors.push(new Bullet(this.x + 8, this.y));
    }
  }

  draw() {
    graphics.drawImage(images.ghost, [this.x, this.y, 32, 32]);
  }
}
