// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require ../sketches/library_demos/p5play/p5.play.js

// art from Buch @ opengameart.org
// https://opengameart.org/content/a-platformer-in-the-forest
// https://opengameart.org/users/buch

let sprite1, sprite2;

function setup() {
  createCanvas(600, 300);

  let kingImage = loadImage("../sketches/cf_challenges/14_microgames/king.png");
  let guyImage = loadImage("../sketches/cf_challenges/14_microgames/guy.png");

  sprite1 = createSprite(200, 150, 50, 50);
  sprite1.addImage("main", kingImage);
  sprite1.addSpeed(1, 0);
  sprite1.scale = 4;

  sprite2 = createSprite(400, 150, 100, 100);
  sprite2.addImage("main", guyImage);
  sprite2.scale = 4;
  sprite2.mirrorX(-1);
  sprite2.addSpeed(1, 180);

  noSmooth();
}

function draw() {
  background(50, 50, 80);

  // if (sprite1.overlap(sprite2)) {
  //   sprite1.setSpeed(0);
  //   sprite2.setSpeed(0);
  // }

  sprite1.bounce(sprite2);
  drawSprites();
}
