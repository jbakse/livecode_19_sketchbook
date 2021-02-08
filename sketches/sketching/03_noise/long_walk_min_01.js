// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let camera_x = 0;
let player_x = 0;

function setup() {
  pixelDensity(1);
  const c = createCanvas(128, 64);
  noSmooth();
  c.canvas.style.width = "512px";
  c.canvas.style.height = "256px";
  c.canvas.style.imageRendering = "pixelated";
  console.log(c.canvas);

  frameRate(60);
}

function draw() {
  a;
  background(0);

  if (keyIsDown(65 /*a*/)) {
    player_x -= 2;
  }

  if (keyIsDown(68 /*d*/)) {
    player_x += 2;
  }

  drawWorld();
}

function drawWorld() {
  // if (abs(camera_x - player_x) > 64)
  camera_x = lerp(camera_x, player_x, 0.05);

  translate(-floor(camera_x) + 64, 0);

  const currentColumn = Math.floor(camera_x / 16);

  for (let col = currentColumn - 4; col < currentColumn + 5; col++) {
    // floor
    noStroke();
    noise(col) > 0.5 ? fill(50) : fill(80);
    rect(col * 16, 48, 16, 16);

    // flower
    noStroke();
    noise(col, 2) > 0.6 ? fill(100) : noFill();
    rect(col * 16, 32, 16, 16);

    // clouds
    noStroke();
    noise(col * 0.1, 3) > 0.5 ? fill(150) : noFill();
    rect(col * 16, 0, 16, 16);
  }

  // draw old man
  noStroke();
  fill("yellow");
  rect(player_x - 16, 32, 16, 16);
}
