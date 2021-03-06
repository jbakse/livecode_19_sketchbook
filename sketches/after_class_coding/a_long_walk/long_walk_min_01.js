// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let camera_x = 0;
let player_x = 0;

function setup() {
  pixelDensity(1);
  const c = createCanvas(128, 64).canvas;
  noSmooth();
  colorMode(HSB, 10);
  c.style.width = "512px";
  c.style.height = "256px";
  c.style.imageRendering = "pixelated";
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
  translate(-floor(camera_x) + 64, 0);

  // sky
  background(6, 3, 9);
  const currentColumn = Math.floor(camera_x / 16);

  for (let col = currentColumn - 4; col < currentColumn + 5; col++) {
    // flower
    noStroke();
    const flowerColors = ["red", "orange", "yellow", "pink", "white"];
    const flowerColor = flowerColors[floor(noise(col) * 5)];
    sin(col) > 0.0 ? fill(flowerColor) : noFill();
    rect(col * 16, 32, 16, 16);

    // grass
    noStroke();
    col % 2 ? fill(3, 10, 7) : fill(3, 9, 6);
    rect(col * 16, 48, 16, 16);

    // clouds
    noStroke();
    noise(col * 0.1, 3) > 0.5 ? fill("white") : noFill();
    rect(col * 16, 0, 16, 16);
  }

  // draw old man
  noStroke();
  fill("white");
  rect(player_x - 16, 32, 16, 16);
}
