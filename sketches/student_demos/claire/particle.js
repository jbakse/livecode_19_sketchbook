// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/addons/p5.sound.js

var particles_a = [];
var particles_b = [];
var particles_c = [];
var nums = 200;
var noiseScale = 800;

let mySound;

function preload() {
  mySound = loadSound("noise.mp3");
}

function setup() {
  createCanvas(800, 600);
  analyzer = new p5.Amplitude();
  analyzer.setInput(mySound);

  startButton = createButton("start");
  startButton.mousePressed(start);
  background(21, 8, 50);

  for (var i = 0; i < nums; i++) {
    particles_a[i] = new Particle(random(0, width), random(0, height));
    particles_b[i] = new Particle(random(0, width), random(0, height));
    particles_c[i] = new Particle(random(0, width), random(0, height));
  }
}

function draw() {
  noStroke();
  smooth();
  const amp = analyzer.getLevel();
  print(amp);

  for (var i = 0; i < nums; i++) {
    var radius = map(i, 0, nums, 1, 2);
    var alpha = map(i, 0, nums, 0, 250);

    fill(69, 33, 124, alpha);
    particles_a[i].move(amp);
    particles_a[i].display(radius);
    particles_a[i].checkEdge();

    fill(7, 153, 242, alpha);
    particles_b[i].move(amp);
    particles_b[i].display(radius);
    particles_b[i].checkEdge();

    fill(255, 255, 255, alpha);
    particles_c[i].move(amp);
    particles_c[i].display(radius);
    particles_c[i].checkEdge();
  }
}

function Particle(x, y) {
  // this.b=0.3
  this.dir = createVector(0, 0);
  this.vel = createVector(0, 0);
  this.pos = createVector(x, y);
  this.speed = 0.8;

  this.move = function (a) {
    var angle = noise(this.pos.x / 800, this.pos.y / 800) * TWO_PI * a * 800;
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    this.vel = this.dir.copy();
    this.vel.mult(a * 20);
    this.pos.add(this.vel);
  };

  this.checkEdge = function () {
    if (
      this.pos.x > width ||
      this.pos.x < 0 ||
      this.pos.y > height ||
      this.pos.y < 0
    ) {
      this.pos.x = random(50, width);
      this.pos.y = random(50, height);
    }
  };

  this.display = function (r) {
    ellipse(this.pos.x, this.pos.y, r, r);
  };
}

function start() {
  mySound.play(0, 1, 1);
}
