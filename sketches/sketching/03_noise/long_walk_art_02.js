// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let camera_x = 0;
let player_x = 0;
let player_facing = 1;
const timeScale = 0.004;
let atlas, tiles;

const flowerColors = ["red", "orange", "yellow", "pink", "white"];

function preload() {
  // art by [munro hoberman](https://munrohoberman.com/)
  atlas = loadImage("../sketches/sketching/03_noise/long_walk.png");
}
function setup() {
  pixelDensity(1);
  const c = createCanvas(128, 64).canvas;
  noSmooth();
  noStroke();
  colorMode(HSB, 10);
  c.style.width = "512px";
  c.style.height = "256px";
  c.style.imageRendering = "pixelated";

  tiles = slice(atlas, 4, 10, 8);
}

function slice(img, cols, rows, size) {
  tiles = [];
  for (x = 0; x < cols; x++) {
    tiles[x] = [];
    for (y = 0; y < rows; y++) {
      const g = createGraphics(size, size);
      //   g.noSmooth();
      g.image(img, 0, 0, size, size, x * size, y * size, size, size);
      tiles[x][y] = g.get();
    }
  }
  return tiles;
}

function draw() {
  if (keyIsDown(65 /*a*/)) {
    player_x -= 2;
    player_facing = -1;
  }

  if (keyIsDown(68 /*d*/)) {
    player_x += 2;
    player_facing = 1;
  }

  drawWorld();
}

function drawWorld() {
  // camera
  camera_x = lerp(camera_x, player_x + 32 * player_facing, 0.1);

  // sky
  background(6, 3, map(cos(frameCount * timeScale), -1, 1, 0, 10));

  backLayer();
  frontLayer();

  //old man
  push();
  translate(-camera_x + 64, 0);
  translate(player_x, 0);
  scale(player_facing, 1);
  translate(-8, 0);
  const player_frame = floor(abs(player_x / 32) % 2);
  image(tiles[player_frame][0], 0, 32, 16, 16);
  pop();

  // night
  push();
  blendMode(MULTIPLY);
  noStroke();
  const t = map(cos(frameCount * timeScale), -1, 1, 6, 0);
  fill(5, t, 10 - t, 8);
  rect(0, 0, 128, 64);
  pop();

  //old man's torch
  push();
  translate(-camera_x + 64, 0);
  translate(player_x, 0);
  scale(player_facing, 1);
  translate(-8, 0);
  if (cos(frameCount * timeScale) < 0) {
    image(tiles[player_frame + 2][0], 0, 32, 16, 16);
  }
  pop();
}

function backLayer() {
  push();
  translate(-camera_x * 0.5 + 64, 0);
  const backColumn = Math.floor(camera_x / 32);
  for (let col = backColumn - 4; col < backColumn + 5; col++) {
    const placeTree = noise(col * 0.25, 10) > 0.5;
    if (placeTree) {
      const treeType = floor(noise(col, 11) * 4);
      image(tiles[treeType][6], col * 16, 16 + 4, 16, 16);
      image(tiles[treeType][7], col * 16, 32 + 4, 16, 16);
    }

    if (col && col % 50 === 0 && !placeTree) {
      const statueType = floor(noise(col, 11) * 2);
      image(tiles[statueType][8], col * 16, 16, 16, 16);
      image(tiles[statueType][9], col * 16, 32, 16, 16);
    }
  }

  pop();
}

function frontLayer() {
  push();
  translate(-camera_x + 64, 0);
  const currentColumn = Math.floor(camera_x / 16);
  for (let col = currentColumn - 4; col < currentColumn + 5; col++) {
    // clouds
    // noise(col * 0.1, 3) > 0.5 ? fill("white") : noFill();
    if (noise(col * 0.1, 3) > 0.5) {
      let cloudType = noise(col, 1) < 0.5 ? 1 : 2;
      const first = noise((col - 1) * 0.1, 3) < 0.5; // is this the first cloud tile in a run?
      const last = noise((col + 1) * 0.1, 3) < 0.5;
      if (first) cloudType = 0;
      if (last) cloudType = 3;
      if (first && last) {
        // noop
      } else {
        image(tiles[cloudType][4], col * 16, 2, 16, 16);
      }
    }

    // flower
    const placeFlower = sin(col) > 0.0;
    if (placeFlower) {
      const flowerType = floor(noise(col, 3) * 4);
      const flowerColor = flowerColors[floor(noise(col) * 5)];

      image(tiles[flowerType][3], col * 16, 32, 16, 16);
    }

    // special
    if (!placeFlower && noise(col) < 0.2) {
      const specialType = floor(noise(col, 3) * 3);
      image(tiles[specialType][5], col * 16, 32, 16, 16);
    }

    // signs

    if (col && col % 50 === 0) {
      const statueType = floor(noise(col, 11) * 2);
      image(tiles[3][5], col * 16, 32, 16, 16);
    }

    // grass
    const grassType = floor(noise(col) * 4);
    image(tiles[grassType][1], col * 16, 48, 16, 16);
  }
  pop();
}
