// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js

// https://contentful.github.io/contentful.js/contentful/9.1.5/
// https://www.contentful.com/developers/docs/references/authentication/
// https://docs.netlify.com/routing/redirects/#structured-configuration
// https://www.contentfulcommunity.com/t/should-i-keep-access-tokens-secret/457/4
/* global Tweakpane contentful*/
/* exported setup draw */

async function getTeamMembers() {
  const client = contentful.createClient({
    space: "hzxcnf5ad0rg",
    accessToken: "GkAWu39B5tiR-fctxIDL7KtPdS5FF2rld7a-L_PnJSs",
  });

  const response = await client.getEntries({ content_type: "teamMember" });
  const members = response.items.map((i) => i.fields);

  const unique_members = uniqWith(members, (a, b) => a.title === b.title);

  return unique_members;
}

const sprites = [];
const member_sprites = [];
const data_sprites = [];

async function setup() {
  createCanvas(1024, 512);

  const members = await getTeamMembers();
  members.forEach((member) => {
    const s = new Sprite();

    s.components.push(
      new Gravity_Component(s, { x: random(0.01, 0.02), y: 0 })
    );
    s.components.push(new Wrap_Component(s));
    s.components.push(new Drag_Component(s, 0.97));
    s.components.push(new Avoid_Component(s, member_sprites, 100, 0.01));
    s.components.push(new Dot_Component(s));
    s.components.push(new Label_Component(s, member.title));

    sprites.push(s);
    member_sprites.push(s);
  });

  times(30, () => {
    const s = new Sprite();

    s.components.push(
      new Gravity_Component(s, { x: random(-0.1, -0.2), y: 0 })
    );
    s.components.push(new Wrap_Component(s));
    s.components.push(new Drag_Component(s, 0.9));
    s.components.push(new Avoid_Component(s, member_sprites, 200, -0.1));
    s.components.push(new Avoid_Component(s, member_sprites, 50, 0.3));
    s.components.push(new Avoid_Component(s, data_sprites, 20, 0.1));

    s.components.push(new Dot_Component(s));
    s.components.push(new Label_Component(s, floor(random(1, 100))));

    sprites.push(s);
    data_sprites.push(s);
  });
}

function draw() {
  background("white");

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
  constructor(sprite, gravity) {
    this.gravity = gravity;
  }
  move(sprite) {
    sprite.deltaY += this.gravity.y;
    sprite.deltaX += this.gravity.x;
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
  constructor(sprite, drag) {
    this.drag = drag;
  }

  move(sprite) {
    sprite.deltaX *= this.drag;
    sprite.deltaY *= this.drag;
  }
}

class Avoid_Component {
  constructor(sprite, targets, radius, strength) {
    this.targets = targets;
    this.radius = radius;
    this.strength = strength;
  }

  move(sprite) {
    this.targeting = [];
    this.targets.forEach((target) => {
      if (target === sprite) return;
      const offsetX = target.x - sprite.x;
      const offsetY = target.y - sprite.y;
      if (abs(offsetX) > this.radius || abs(offsetY) > this.radius) return;

      const fX = map(offsetX, -this.radius, this.radius, 1, -1);
      const fY = map(offsetY, -this.radius, this.radius, 1, -1);
      sprite.deltaX += fX * this.strength;
      sprite.deltaY += fY * this.strength;

      this.targeting.push(target);
    });
  }

  draw(sprite) {
    // push();
    // noFill();
    // stroke(0, 10);
    // translate(sprite.x, sprite.y);
    // ellipse(0, 0, this.radius * 2, this.radius * 2);
    // pop();

    push();
    noFill();
    this.targeting.forEach((target) => {
      const d = dist(sprite.x, sprite.y, target.x, target.y);
      stroke(0, map(d, 0, this.radius * 0.5, 255, 0));

      line(sprite.x, sprite.y, target.x, target.y);
    });

    pop();
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

class Label_Component {
  constructor(sprite, text) {
    this.text = text;
  }
  draw(sprite) {
    push();
    fill("black");
    noStroke();
    textAlign(CENTER);
    translate(sprite.x, sprite.y + 20);
    text(this.text, 0, 0);
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
// runs `f` function `t` times, returns array of results
function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

// returns unique items in array `a` using function `fn` to test uniquness
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
const uniqWith = (a, fn) =>
  a.filter(
    (element, index) => a.findIndex((step) => fn(element, step)) === index
  );
