// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Yang Zhao

// (1). Start from the top of your page and draw 5 x 5 evenly spaced dots that resemble a grid.

// (2). Start with a random dot and connect it with an immediately neighboring dot (can be diagonal) in one line.

// (3). Repeat (2) and make sure all dots are connected and the line is not crossed.

// (4). Start from another position on your page and repeat (1), (2), (3) to create a different line path.

// (5). Repeat (4) until you are bored or exhaust all possible paths.

const gridHistory = [];
window.setup = () => {
  createCanvas(600, 600);
  background(250);

  strokeWeight(1.5);

  angleMode(DEGREES);

  frameRate(60);
  loop();
};

window.draw = () => {
  const x = random(width);
  const y = random(height);
  // eslint-disable-next-line
  if (gridHistory.every((p) => dist(x, y, p.x, p.y) > 150)) {
    gridHistory.push({ x, y });
    push();
    translate(x, y);
    rotate(random(-20, 20) + random(-20, 20));
    translate(-50, -50);
    drawGrid();
    pop();
  }
};

function drawGrid() {
  fill(30, 30, 90);
  noStroke();
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      ellipse(x * 20, y * 20, 3, 3);
    }
  }

  noFill();
  stroke(30, 30, 90);
  let x = randomInt(5);
  let y = randomInt(5);
  const dotHistory = [{ x, y }];
  for (let i = 0; i < 250; i++) {
    const nextX = constrain(x + randomInt(-1, 2), 0, 4);
    const nextY = constrain(y + randomInt(-1, 2), 0, 4);

    // make sure nextX, nextY is not in dotHistory
    if (dotHistory.every((p) => p.x !== nextX || p.y !== nextY)) {
      line(x * 20, y * 20, nextX * 20, nextY * 20);
      x = nextX;
      y = nextY;
      dotHistory.push({ x: nextX, y: nextY });
    }
  }
}

function randomInt(min, max) {
  return Math.floor(random(min, max));
}
