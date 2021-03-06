// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* globals sketch_directory */

const TIME_SCALE = 0.001;
let atlas, tiles;

let camera_x = 0;
let player_x = 0;
let player_facing = 1;
let time = 0;

function preload() {
  // art by [munro hoberman](https://munrohoberman.com/)
  atlas = loadImage(sketch_directory + "long_walk.png");
}

function setup() {
  pixelDensity(1);
  const c = createCanvas(128, 64).canvas;
  createDiv("a = left; d = right. go check out the statues");
  c.style.width = "512px";
  c.style.height = "256px";
  c.style.imageRendering = "pixelated";

  noiseDetail(1);
  noSmooth();
  noStroke();
  colorMode(HSB, 10);

  tiles = slice(atlas, 8, 10, 8);
}

function draw() {
  handleInput();
  drawWorld();
}

function handleInput() {
  const boost = keyIsDown(SHIFT) ? 1.2 : 0.8;

  if (keyIsDown(65 /*a*/)) {
    player_x -= 2 * boost;
    player_facing = -1;
  }
  if (keyIsDown(68 /*d*/)) {
    player_x += 2 * boost;
    player_facing = 1;
  }
}

function drawWorld() {
  // camera
  camera_x = lerp(camera_x, player_x + 32 * player_facing, 0.1);

  // time -1 midnight, 1 noon
  time = signedPow(cos(frameCount * TIME_SCALE), 0.6);

  // calc desert intensity
  const targetCol = Math.floor(camera_x / 16);
  const desertIntensity = map(
    sin((targetCol - 100) * 0.01),
    0.9,
    0.95,
    0,
    1,
    true
  );

  // sky
  background(6, 7, map(time, -1, 1, 0, 10));
  backLayer();

  if (desertIntensity > 0) {
    push();
    colorMode(RGB, 1);
    fill(1, 1, 0.5, desertIntensity * 0.5 * map(time, -1, 1, 0, 1));
    rect(0, 0, width, height);
    pop();
  }

  frontLayer();

  oldMan();

  night();
  torch();
}

function backLayer() {
  push();
  translate(-camera_x * 0.5 + 64, 0);

  const targetCol = Math.floor(camera_x / 32);

  for (let col = targetCol - 4; col <= targetCol + 4; col++) {
    const desertOffset = sin((col - 50) * 0.02) > 0.75 ? 4 : 0;

    // multiples of 50, except 0
    const placeStatue = col && col % 50 === 0;
    if (placeStatue) {
      const statueTop = noiseInt(0, 4, col, 1);
      const statueBottom = noiseInt(0, 4, col, 2);
      image(tiles[statueTop + desertOffset][8], col * 16, 16, 16, 16);
      image(tiles[statueBottom + desertOffset][9], col * 16, 32, 16, 16);
    }

    // half the time, medium frequency
    const placeTree = noiseBool(0.5, col * 0.25, 1);
    if (placeTree && !placeStatue) {
      const treeType = noiseInt(0, 4, col, 11);
      image(tiles[treeType + desertOffset][6], col * 16, 16 + 4, 16, 16);
      image(tiles[treeType + desertOffset][7], col * 16, 32 + 4, 16, 16);
    }

    // if (desertOffset) {
    //   fill(1, 10, 10, 5);
    //   rect(col * 16, 0, 16, 64);
    // }
  }

  pop();
}

function frontLayer() {
  push();
  translate(-camera_x + 64, 0);

  const targetColumn = Math.floor(camera_x / 16);

  for (let col = targetColumn - 4; col < targetColumn + 5; col++) {
    const desertOffset = sin((col - 100) * 0.01) > 0.75 ? 4 : 0;

    // clouds
    const cloudiness = 0.5;
    const placeClouds = noiseBool(cloudiness, col * 0.1, 1);
    // is this the first or last cloud tile in a run?
    const first = !noiseBool(cloudiness, (col - 1) * 0.1, 1);
    const last = !noiseBool(cloudiness, (col + 1) * 0.1, 1);

    if (placeClouds) {
      let cloudType = noiseInt(1, 3, col, 2);
      if (first) cloudType = 0;
      if (last) cloudType = 3;
      if (!(first && last)) {
        //skip a cloud if its the first and last
        image(tiles[cloudType + desertOffset][4], col * 16, 2, 16, 16);
      }
    }

    // flower
    const placeFlower = sin(col) > 0.0;
    if (placeFlower) {
      const flowerType = noiseInt(0, 4, col, 3);
      image(tiles[flowerType + desertOffset][3], col * 16, 32, 16, 16);
    }

    // special
    if (!placeFlower && noiseBool(0.2, col)) {
      const specialType = noiseInt(0, 3, col, 3);
      image(tiles[specialType + desertOffset][5], col * 16, 32, 16, 16);
    }

    // signs
    if (col && col % 100 === 0) {
      image(tiles[3][5], col * 16, 32, 16, 16);
    }

    // grass
    const grassType = noiseInt(0, 4, col);
    image(tiles[grassType + desertOffset][1], col * 16, 48, 16, 16);
  }
  pop();
}

function oldMan() {
  push();
  translate(-camera_x + 64, 0);
  translate(player_x, 0);
  scale(player_facing, 1);
  translate(-8, 0);
  const player_frame = floor(abs(player_x / 32) % 2);
  image(tiles[player_frame][0], 0, 32, 16, 16);
  pop();
}

function night() {
  push();
  blendMode(MULTIPLY);
  noStroke();

  const s = map(time, -1, 1, 8, 0);
  const b = map(time, -1, 1, 9, 10);
  fill(6, s, b);
  rect(0, 0, 128, 64);
  pop();
}

function torch() {
  push();
  translate(-camera_x + 64, 0);
  translate(player_x, 0);
  scale(player_facing, 1);
  translate(-8, 0);
  if (cos(frameCount * TIME_SCALE) < 0) {
    const player_frame = floor(abs(player_x / 32) % 2);
    image(tiles[player_frame + 2][0], 0, 32, 16, 16);
  }

  pop();
}

function noiseInt(min, max, x = 0, y = 0, z = 0) {
  return floor(map(noise(x, y, z), 0, 0.5, min, max));
}

function noiseBool(threshold, x = 0, y = 0, z = 0) {
  return noise(x, y, z) < threshold * 0.5;
}

function signedPow(a, b) {
  return pow(abs(a), b) * Math.sign(a);
}

function slice(img, cols, rows, size) {
  tiles = [];
  for (let x = 0; x < cols; x++) {
    tiles[x] = [];
    for (let y = 0; y < rows; y++) {
      const g = createGraphics(size, size);
      g.image(img, 0, 0, size, size, x * size, y * size, size, size);
      tiles[x][y] = g.get();
    }
  }
  return tiles;
}
