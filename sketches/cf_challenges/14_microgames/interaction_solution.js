// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require ../sketches/library_demos/p5play/p5.play.js

// art from Buch @ opengameart.org
// https://opengameart.org/content/a-platformer-in-the-forest
// https://opengameart.org/users/buch

let sprites = [];

function setup() {
  createCanvas(600, 300);

  let kingImage = loadImage("../sketches/cf_challenges/14_microgames/king.png");

  // loop 10
  for (let i = 0; i < 10; i++) {
    const sprite = createSprite(random(width), random(height), 100, 100);
    sprite.addImage("main", kingImage);
    sprite.scale = 4;
    sprite.mouseActive = true;
    sprites.push(sprite);
  }
}

function draw() {
  background(50, 50, 80);

  for (const s of sprites) {
    if (s.mouseIsOver) {
      s.rotation += 10;
    } else {
      s.rotation += 0;
    }
  }

  noSmooth();
  drawSprites();
}

function mouseReleased() {
  console.log("click");
  for (const s of sprites) {
    if (s.mouseIsOver) {
      s.remove();
    }
  }
}
