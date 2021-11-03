// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// redoing drops_03.js

const pane = new Tweakpane();
const params = { tracers: 0.12, force: 1, size: 11, spawnAge: 1, cullAge: 10 };

let dots = [];

function setup() {
  createCanvas(720, 480);
  frameRate(60);

  // configure the parameter pane
  pane.addInput(params, "tracers", { min: 0, max: 1, step: 0.01 });
  pane.addInput(params, "force", { min: 0, max: 1, step: 0.01 });
  pane.addInput(params, "size", { min: 0, max: 100, step: 1 });
  pane.addInput(params, "spawnAge", { min: 0, max: 300, step: 1 });
  pane.addInput(params, "cullAge", { min: 0, max: 300, step: 1 });

  params.frameRate = frameRate();
  pane.addMonitor(params, "frameRate");

  pane
    .addButton({
      title: "Copy Params",
    })
    .on("click", () => {
      navigator.clipboard.writeText(JSON.stringify(pane.exportPreset()));
      console.log(pane.exportPreset());
    });

    

  // kick off
  Dot.spawnNear(width * 0.5, height * 0.5, 0);
}

function draw() {
  background(0, pow(params.tracers, 2) * 255);

  dots.forEach((d) => d.step());
  dots.forEach((d) => d.draw());

  params.frameRate = frameRate();
}

function mouseReleased(e) {
  if (e.srcElement.id != "defaultCanvas0") return;
  Dot.spawnNear(mouseX, mouseY, 0);
}

class Dot {
  static spawnNear(x, y, r) {
    const p = randomPointOnCircle();
    const d = new Dot(x + p.x * r, y + p.y * r);
    dots.push(d);
    return d;
  }

  constructor(x = 0, y = 0) {
    this.x = constrain(x, 0, width);
    this.y = constrain(y, 0, height);
    this.dY = 0;
    this.age = 0;
  }

  step() {
    // spread
    dots.forEach((other) => {
      if (other === this) return;

      // ignore dots that are far away
      if (!closer(this.x, this.y, other.x, other.y, 100)) return;

      // find angle to other dot
      let a = atan2(this.y - other.y, this.x - other.x);

      // this force is constant within the circle of influence
      // more commonly you'd fade force off with distance
      this.x += cos(a) * params.force;
      this.y += sin(a) * params.force;
    });

    // spawn new dots
    if (this.age === params.spawnAge) {
      Dot.spawnNear(this.x, this.y, 6);
    }

    // remove old dots
    if (this.age > params.cullAge) {
      dots.splice(dots.indexOf(this), 1);
    }

    this.age += 1;
  }

  draw() {
    push();

    let radius = map(this.age, 0, params.cullAge, 1, params.size);
    let alpha = map(this.age, params.cullAge * 0.5, params.cullAge, 255, 0);
    noFill();
    stroke(255, alpha);
    ellipse(this.x, this.y, radius, radius);

    pop();
  }
}

function closer(x1, y1, x2, y2, d) {
  if (abs(x1 - x2) > d) return false;
  if (abs(y1 - y2) > d) return false;
  if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) > d * d) return false;
  return true;
}

function randomPointInCircle() {
  let r = sqrt(random());
  let a = random() * 2 * PI;
  return { x: cos(a) * r, y: sin(a) * r };
}

function randomPointOnCircle() {
  let r = 1;
  let a = random() * 2 * PI;
  return { x: cos(a) * r, y: sin(a) * r };
}
