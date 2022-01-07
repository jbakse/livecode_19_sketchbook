// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js

/* global Tweakpane */
/* exported setup draw */

const pane = new Tweakpane.Pane();
const params = {
  particles: 30,
  gravity: {
    x: 0.05,
    y: 0.0,
  },
  radius: 50,
  strength: 1,
  drag: 0.98,
};

const sprites = [];

function setup() {
  createCanvas(1024, 512);

  pane.addInput(params, "particles", { min: 1, max: 100, step: 1 });
  pane.addInput(params, "gravity", {
    x: {
      min: -0.5,
      max: 0.5,
    },
    y: {
      min: -0.5,
      max: 0.5,
    },
    picker: "inline",
    expanded: true,
  });

  pane.addInput(params, "radius", { min: 1, max: 100, step: 1 });
  pane.addInput(params, "strength", { min: -5, max: 5 });
  pane.addInput(params, "drag", { min: 0.7, max: 1 });

  pane.addButton({ title: "wind" }).on("click", () => {
    pane.importPreset(wind);
    sprites.splice(1);
  });

  pane.addButton({ title: "critical" }).on("click", () => {
    pane.importPreset(critical);
    sprites.splice(1);
  });

  pane.addButton({ title: "crazy" }).on("click", () => {
    pane.importPreset(crazy);
    sprites.splice(1);
  });

  pane.addButton({ title: "balanced" }).on("click", () => {
    pane.importPreset(balanced);
    sprites.splice(1);
  });

  const s = new Sprite();
  s.components.push(new Mouse_Component(s));
  sprites.push(s);
}

function draw() {
  background("white");

  // add particles
  while (sprites.length < params.particles) {
    const s = new Sprite();

    s.components.push(new Gravity_Component(s));
    s.components.push(new Wrap_Component(s));
    s.components.push(new Drag_Component(s));
    s.components.push(new Avoid_Component(s));
    s.components.push(new Dot_Component(s));

    sprites.push(s);
  }
  // remove particles
  sprites.splice(params.particles + 1);

  sprites.forEach((s) => s.move());
  sprites.forEach((s) => s.draw());
}

class Sprite {
  constructor(x = random(width), y = random(height)) {
    this.x = x;
    this.y = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.components = [];
  }

  move() {
    // this.components.forEach((c) => c.move && c.move.call(this));
    this.x += this.deltaX;
    this.y += this.deltaY;
    this.components.forEach((c) => c.move && c.move(this));
  }

  draw() {
    // this.components.forEach((c) => c.draw && c.draw.call(this));
    this.components.forEach((c) => c.draw && c.draw(this));
  }
}

class Gravity_Component {
  move(sprite) {
    sprite.deltaY += params.gravity.y;
    sprite.deltaX += params.gravity.x;
  }
}

class Wrap_Component {
  move(sprite) {
    if (sprite.x < 0) sprite.x += width;
    if (sprite.y < 0) sprite.y += height;
    if (sprite.x > width) sprite.x -= width;
    if (sprite.y > height) sprite.y -= height;
  }
}

class Drag_Component {
  move(sprite) {
    sprite.deltaX *= params.drag;
    sprite.deltaY *= params.drag;
  }
}

class Avoid_Component {
  move(sprite) {
    sprites.forEach((target) => {
      if (target === sprite) return;
      const offsetX = target.x - sprite.x;
      const offsetY = target.y - sprite.y;
      if (abs(offsetX) > params.radius || abs(offsetY) > params.radius) return;

      const fX = map(offsetX, -params.radius, params.radius, 1, -1);
      const fY = map(offsetY, -params.radius, params.radius, 1, -1);
      sprite.deltaX += fX * params.strength;
      sprite.deltaY += fY * params.strength;
    });
  }
}

class Dot_Component {
  draw(sprite) {
    push();
    fill("black");
    noStroke();
    translate(sprite.x, sprite.y);
    ellipse(0, 0, 10, 10);
    pop();
  }
}

class Mouse_Component {
  move(sprite) {
    sprite.x = mouseX;
    sprite.y = mouseY;
  }
  draw(sprite) {
    push();
    fill("red");
    noStroke();
    translate(sprite.x, sprite.y);
    ellipse(0, 0, 50, 50);
    pop();
  }
}

/* exported times */
// runs f function t times, returns array of results
function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

const crazy = {
  particles: 100,
  gravity: {
    x: 0,
    y: 0.1,
  },
  radius: 100,
  strength: 1,
  drag: 0.98,
};

const critical = {
  particles: 53,
  gravity: {
    x: 0,
    y: 0,
  },
  radius: 51,
  strength: 5,
  drag: 0.895,
};

const wind = {
  particles: 31,
  gravity: {
    x: 0.25,
    y: 0,
  },
  radius: 61,
  strength: -2,
  drag: 0.97,
};

const balanced = {
  particles: 30,
  gravity: {
    x: 0.05,
    y: 0.0,
  },
  radius: 50,
  strength: 1,
  drag: 0.98,
};
