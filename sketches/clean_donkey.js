let haystacks = [];
haystacks[0] = { x: 300, y: 100 };
haystacks[1] = { x: 100, y: 500 };
haystacks[2] = { x: 500, y: 500 };

let donkey = { x: 300, y: 300 };

window.setup = function() {
  createCanvas(600, 600);
  background(50, 50, 50);
};

window.draw = function() {
  for (let i = 0; i < 100; i++) {
    updateSelf();
    drawSelf();
  }
};

function updateSelf() {
  let haystackIndex = floor(random(3));
  donkey.x = lerp(donkey.x, haystacks[haystackIndex].x, 0.5);
  donkey.y = lerp(donkey.y, haystacks[haystackIndex].y, 0.5);
}

function drawSelf() {
  fill("red");
  for (const haystack of haystacks) {
    ellipse(haystack.x, haystack.y, 10, 10);
  }

  fill("white");
  noStroke();
  ellipse(donkey.x, donkey.y, 1, 1);
}
