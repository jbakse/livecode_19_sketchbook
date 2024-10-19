import { graphics, images } from "./block_invaders_01.js";

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  step() {
    this.y += 2;
  }

  draw() {
    graphics.drawImage(images.ghost, [this.x, this.y, 32, 32], { tint: "red" });
  }
}
