// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* globals sketch_directory */
/* exported preload setup draw keyPressed*/
const images = {};

const player = {
  row: 1,
  col: 1,
};

const DARKNESS = false;

let playerX = player.row * 8;
let playerY = player.col * 8;

function preload() {
  // sketch_directory is needed for my "sketchbook" system
  // _you_ can probably just use "./asets"
  const assets = `${sketch_directory}/assets`;

  // mapDisplay is a 128x128 image to draw to screen
  images.mapDisplay = loadImage(`${assets}/map_display.png`);

  // mapCollision is a 16x16 image to check for collisions
  // the red channel is 255 for walls, 0 for empty space
  images.mapCollision = loadImage(`${assets}/map_collision.png`);

  // avatar is a 8x8 image to represent the player

  images.avatar = [];
  images.avatar[0] = loadImage(`${assets}/avatar_01.png`);
  images.avatar[1] = loadImage(`${assets}/avatar_02.png`);
  images.avatar[2] = loadImage(`${assets}/avatar_03.png`);
  images.avatar[3] = loadImage(`${assets}/avatar_02.png`);
}

function setup() {
  const c = createCanvas(128, 128).canvas;
  c.style.width = "512px";
  c.style.height = "512px";
  c.style.imageRendering = "pixelated";
  noSmooth();
}

function draw() {
  update();

  if (DARKNESS) {
    blendMode(NORMAL);
    drawLighting();
    filter(BLUR, 4);
    // filter(POSTERIZE, 2);
    blendMode(MULTIPLY);
  }

  drawWorld();
  blendMode(NORMAL);
  drawUnlit();
}

function update() {
  if (frameCount % 4 === 0) {
    if (playerX < player.col * 8) {
      playerX += 1;
    }
    if (playerX > player.col * 8) {
      playerX -= 1;
    }
    if (playerY < player.row * 8) {
      playerY += 1;
    }
    if (playerY > player.row * 8) {
      playerY -= 1;
    }
  }
}
function drawLighting() {
  push();

  blendMode(NORMAL);
  background("black");

  blendMode(ADD);
  noStroke();
  fill("#aaa");
  // player
  ellipse(player.col * 8 + 4, player.row * 8 + 4, 32);
  // goal
  ellipse(100, 100, 32);

  pop();
}

function drawWorld() {
  image(images.mapDisplay, 0, 0);
}

function drawUnlit() {
  const frame = floor(playerX / 2 + playerY / 2) % 4;
  image(images.avatar[frame], playerX, playerY);
  image(images.avatar[0], 80, 40);
}

function keyPressed() {
  const left = keyCode === LEFT_ARROW || key === "a";
  const right = keyCode === RIGHT_ARROW || key === "d";
  const up = keyCode === UP_ARROW || key === "w";
  const down = keyCode === DOWN_ARROW || key === "s";

  if (left && !isWall(player.row, player.col - 1)) {
    player.col--;
  } else if (right && !isWall(player.row, player.col + 1)) {
    player.col++;
  } else if (up && !isWall(player.row - 1, player.col)) {
    player.row--;
  } else if (down && !isWall(player.row + 1, player.col)) {
    player.row++;
  }
}

function isWall(row, col) {
  const color = images.mapCollision.get(col, row);
  return color[0] === 255; // checking red channel
}
