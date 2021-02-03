// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

class TrafficLight {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = "yield";
    // setInterval(() => this.changeStatus(), 1000);
  }

  changeStatus() {
    this.status = random(["stop", "yield", "go"]);
  }

  step() {
    if (frameCount % 60 === 0) this.changeStatus();
  }

  draw() {
    noStroke();
    fill(0);
    rect(this.x, this.y, 100, 300);

    this.status === "stop" ? fill(255, 0, 0) : fill(50, 0, 0);
    ellipse(this.x + 50, this.y + 50, 80, 80);

    this.status === "yield" ? fill(255, 255, 0) : fill(50, 50, 0);
    ellipse(this.x + 50, this.y + 150, 80, 80);

    this.status === "go" ? fill(0, 255, 0) : fill(0, 50, 0);
    ellipse(this.x + 50, this.y + 250, 80, 80);
  }
}

const trafficLight = new TrafficLight(100, 100);

function setup() {
  createCanvas(512, 512);
  frameRate(60);
}

function draw() {
  background(50);
  trafficLight.step();
  trafficLight.draw();
}

function mousePressed() {
  trafficLight.changeStatus();
}
