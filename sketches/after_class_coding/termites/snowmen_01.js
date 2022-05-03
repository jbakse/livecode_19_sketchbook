// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.js

/**
 * sprites[]
 * this array will hold all the sprites (trees and snowmen)
 * each element in the array will be an object {}
 *
 * objects will have these traits
 * x - float, the horizontal location
 * y - float, the vertical location
 * type - "snowman" | "tree"
 *
 */
const sprites = [];
let spriteSheet;

function preload() {
  // load the image in from a data url
  // a data url stores the data itself instead of the location of the data
  // the pixel editor I used (piskel) can export data urls easily
  // embedding data in the script lets this sketch stay one file
  spriteSheet = loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAACBUlEQVRIS71WMU7DQBDcK5BAoqHnB1AgmQrR0aEoD+AB52ck+QSS7wE8AFFCF1HZEgX5AEKipEECKcWh9WmdtbO7R4LgGkc5+2Z2dnZsB3+5jnYiLJbOglA3q6qK/MGyLM2DRJBtCSC49753ZggBNiKB4JMDgNk7WCqsVSWBE5ONSGxDwAJvmqblgdesEgSOD8y/AB4+VRV6CgwJOOcgxmQF/F3X9f8SIOmx6qIoWvCsAsPqz3dNFUwFSPLi/rQzZDio9BZY4Bd7YitUE1LViIzmo6X2H8FpIRgu7D0B85li2SASQLmllZWfHuIToFROt8rhMo2xHiXXd85/8wBTlw8jaQIMEmseQMDyDgCKfhBBE6AaJUJmGzB8aPy4AXMeWBvB8arveF68TYTUSdAMSDJyP0ge0ELIzVZuiBOFQM6AhhHbFlgJiPstiSYpUk+SQVVDSgbMeSBLYBx6LVAJWAa0PJAjQICUhiKB33ggR4BHcW806RthE/CBEt0YIgmskIcQT0N6G65Vzw0opZf132K5ChauggYsVq8AXB1DF803z6AGmBhEVhSbQcTIXF8mAvMXgB8RoG9ATLnh9yCdS3tSEnrvYwjB4RXvP3lNY4sE9s88vtDaPbxy0bocoEMRnP/mFdMev4cfxkkggadDDx+PoSWASyIh9mYIoAFq/uJEtMrp2W/eCsMoubZc+gAAAABJRU5ErkJggg==');
}

function setup() {
  createCanvas(500, 500);
  noiseDetail(1);

  // init trees
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const sprite = {};
      sprite.x = x * 40 + 50 + random(-10, 10);
      sprite.y = y * 40 + 50 + random(-10, 10);
      sprite.type = 'tree';
      sprite.draw = drawTree;
      sprite.step = stepTree;
      sprites.push(sprite);
    }
  }

  // init snowmen
  for (let i = 0; i < 10; i++) {
    const sprite = {};
    sprite.id = i;
    sprite.type = 'snowman';
    sprite.draw = drawSnowman;
    sprite.step = stepSnowman;
    sprite.x = random(0, 500);
    sprite.y = random(0, 500);
    sprite.dX = random(3, 6);
    sprite.dY = random(3, 6);
    sprite.cargo = undefined;
    sprite.cooldown = 0;
    sprites.push(sprite);
  }


}

function draw() {
  background(255);

  // polymorphism!
  // here, we loop through all the sprite objects in the sprites array
  // we can call the .step function on every object but get different results for
  // trees and snowman.
  // we get different results because the .step function is different on trees and snowmen
  for (let i = 0; i < 1; i++) {
    sprites.forEach((sprite) => {
      sprite.step();
    });
  }

  // sort!
  // the array.sort() function takes a function as a parameter
  // this function is used to compare objects in the array
  // the function should report which object should be first
  // this uses compact syntax, compares the .y of a and b and responds
  // with -1 if a.y is less, or 1 otherwise
  sprites.sort((a, b) => (a.y < b.y ? -1 : 1));

  // just like step
  sprites.forEach((sprite) => {
    sprite.draw();
  });

}


// these functions are going to be stored on the sprites to draw and move them
// instead of taking a parameter, these functions use the "this" keyword
// the this keyword is assigned a value based on how you call it
// we'll be calling it as a property of an object (like sprite.draw())
// when you call it that way this will be the object itself

function stepSnowman() {
  this.x += this.dX;
  this.y += this.dY;
  if (this.x < 0) {
    this.dX = abs(this.dX);
  }
  if (this.x > width) {
    this.dX = -abs(this.dX);
  }
  if (this.y < 0) {
    this.dY = abs(this.dY);
  }
  if (this.y > height) {
    this.dY = -abs(this.dY);
  }

  let foundTree = false;

  sprites.forEach((otherSprite) => {
    if (otherSprite.type === 'snowman') {
      return;
    }
    if (otherSprite === this.cargo) {
      return;
    }
    if (dist(this.x, this.y, otherSprite.x, otherSprite.y) < 10) {
      foundTree = otherSprite;
    }
  });

  const hasCargo = this.cargo !== undefined;

  if (foundTree && hasCargo) {
    this.cargo = undefined;
    this.cooldown = 50;
  }

  if (foundTree && !hasCargo) {
    if (this.cooldown === 0) {
      this.cargo = foundTree;
    }
  }


  if (this.cargo) {
    this.cargo.x = this.x - 3;
    this.cargo.y = this.y - 5;
  }

  if (this.cooldown > 0) {
    this.cooldown--;
  }


}

function stepTree() {
  // nothing
}

function drawSnowman() {
  // wrapping this with push and pop
  // so that changes to fill/stroke/matix/etc
  // won't leak to other parts of the program
  push();
  translate(this.x, this.y - 12);
  const drawScale = map(this.y, 0, height, 1, 2);
  // scale(drawScale);
  imageMode(CENTER);
  image(spriteSheet, 0, 0, 16, 24, 0, 0, 16, 24);
  pop();
}

function drawTree() {
  push();
  translate(this.x, this.y - 12);
  const drawScale = map(this.y, 0, height, 1, 2);
  // scale(drawScale);
  imageMode(CENTER);
  image(spriteSheet, 0, 0, 16, 24, 16, 0, 16, 24);
  pop();
}

// this is handy
function keyPressed() {
  if (key === 'S') {
    save('canvas.jpg');
  }
}
