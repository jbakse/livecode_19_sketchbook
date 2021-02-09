// data:image/png;base64,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

// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let camera_x = 0;
let player_x = 0;

// art by [munro hoberman](https://munrohoberman.com/)
// let atlasData =
//   "data:image/png;base64,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";
let atlas, tiles;

function preload() {
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
