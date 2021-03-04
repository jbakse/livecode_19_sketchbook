// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let camera_x = 0;
let player_x = 0;

let atlas, tiles;

function preload() {
  // art by [munro hoberman](https://munrohoberman.com/)
  atlas = loadImage("../sketches/sketching/03_noise/long_walk.png");
}
function setup() {
  pixelDensity(1);
  const c = createCanvas(128, 64).canvas;
  noSmooth();
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
  }

  if (keyIsDown(68 /*d*/)) {
    player_x += 2;
  }

  drawWorld();
}

function drawWorld() {
  // camera
  camera_x = lerp(camera_x, player_x, 0.05);
  translate(-camera_x + 64, 0);

  // sky
  background(6, 3, 9);
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

    push();
    translate(0, elevation(col));

    // flower
    noStroke();

    if (sin(col) > 0.0) {
      const stemType = noise(col, 2) < 0.5 ? 0 : 1;
      image(tiles[stemType][3], col * 16, 32, 16, 16);

      const flowerType = noise(col, 3) < 0.5 ? 2 : 3;
      const flowerColors = ["red", "orange", "yellow", "pink", "white"];
      const flowerColor = flowerColors[floor(noise(col) * 5)];
      tint(flowerColor);

      image(tiles[flowerType][3], col * 16, 32, 16, 16);
    }
    noTint();

    // grass
    noStroke();
    col % 2 ? tint(7) : tint(10);
    // rect(col * 16, 48, 16, 16);
    image(tiles[0][1], col * 16, 48, 16, 16);
    noTint();
    pop();
  }

  // draw old man
  const player_frame = floor(abs(player_x / 32) % 2);
  translate(0, elevation(floor((player_x - 8) / 16)));

  image(tiles[player_frame][0], player_x - 16, 32, 16, 16);
}

function elevation(col) {
  return 0;
  return floor(noise(col * 0.2) * 8) * 2;
}
