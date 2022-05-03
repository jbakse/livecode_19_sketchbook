// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(500, 500);
}

function draw() {
  fill("black");
  stroke("white");

  let locY = 0;
  for (let y = 0; y < 30; y++) {
    let locX = 0;
    const height = noise(y, frameCount * 0.01) * 60;
    for (let x = 0; x < 30; x++) {
      const width = noise(y, x, frameCount * 0.01) * 60;
      rect(locX, locY, width, height);
      locX += width;
    }
    locY += height;
  }
}
