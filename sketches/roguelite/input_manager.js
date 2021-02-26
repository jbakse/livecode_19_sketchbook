/*exported InputManager*/

class InputManager {
  constructor() {
    this.is_down = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    this.down_count = {
      left: 0,
      right: 0,
      up: 0,
      down: 0,
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.is_down.left = true;
      if (e.key === "ArrowRight") this.is_down.right = true;
      if (e.key === "ArrowUp") this.is_down.up = true;
      if (e.key === "ArrowDown") this.is_down.down = true;
      if (e.key === "a") this.is_down.left = true;
      if (e.key === "d") this.is_down.right = true;
      if (e.key === "w") this.is_down.up = true;
      if (e.key === "s") this.is_down.down = true;
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") this.is_down.left = false;
      if (e.key === "ArrowRight") this.is_down.right = false;
      if (e.key === "ArrowUp") this.is_down.up = false;
      if (e.key === "ArrowDown") this.is_down.down = false;
      if (e.key === "a") this.is_down.left = false;
      if (e.key === "d") this.is_down.right = false;
      if (e.key === "w") this.is_down.up = false;
      if (e.key === "s") this.is_down.down = false;
    });
  }
  step() {
    if (!this.is_down.left) this.down_count.left = 0;
    if (!this.is_down.right) this.down_count.right = 0;
    if (!this.is_down.up) this.down_count.up = 0;
    if (!this.is_down.down) this.down_count.down = 0;

    if (this.is_down.left) this.down_count.left++;
    if (this.is_down.right) this.down_count.right++;
    if (this.is_down.up) this.down_count.up++;
    if (this.is_down.down) this.down_count.down++;
  }
  button(button) {
    return !!this.is_down[button];
  }
  buttonDown(button, rate = 10) {
    return this.down_count[button] % rate === 1;
  }
}
