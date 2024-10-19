import { Bullet } from "./bullet.js";
import {
  graphics,
  images,
  controls,
  actors,
  fps,
} from "./block_invaders_01.js";

export class Player {
  constructor() {
    this.x = 512;
    this.y = 960;
    this.weapon = new Weapon(this);
  }

  step() {
    if (controls.left.down) {
      this.x -= 4;
    }
    if (controls.right.down) {
      this.x += 4;
    }
    this.weapon?.step();
  }

  draw() {
    graphics.drawImage(images.ghost, [this.x, this.y, 32, 32]);
  }
}

export class Weapon {
  constructor(owner) {
    this.owner = owner;
  }
  step() {
    if (controls.fire.pressed) {
      actors.push(new Bullet(this.owner.x + 8, this.owner.y));
    }
  }
}

export class AutoWeapon {
  constructor(owner) {
    this.owner = owner;
  }
  step() {
    if (controls.fire.down) {
      if (fps.frameCount % 10 === 0)
        actors.push(new Bullet(this.owner.x + 8, this.owner.y));
    }
  }
}
