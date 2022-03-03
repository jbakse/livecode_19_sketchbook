// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

function setup() {
  createCanvas(512, 512);
  noLoop();
}

function draw() {
  background("gray");

  let startTime, endTime;

  // p5 random()
  startTime = performance.now();
  let total = 0;
  for (let i = 0; i < 1000000; i++) {
    total += random(5, 10);
  }
  endTime = performance.now();
  console.log(
    "random(5, 10) took " + (endTime - startTime) + " milliseconds.",
    startTime,
    endTime,
    total
  );

  // Math.random()
  startTime = performance.now();
  total = 0;
  for (let i = 0; i < 1000000; i++) {
    total += Math.random() * 5 + 5;
  }
  endTime = performance.now();
  console.log(
    "Math.random() * 5 + 5 took " + (endTime - startTime) + " milliseconds.",
    startTime,
    endTime,
    total
  );

  // p5 random() and ellipse()
  startTime = performance.now();
  for (let i = 0; i < 100000; i++) {
    ellipse(Math.random() * width, 100, 10, 10);
  }
  endTime = performance.now();
  console.log(
    "random(width) took " + (endTime - startTime) + " milliseconds.",
    startTime,
    endTime
  );

  // Math.random() and ellipse()
  startTime = performance.now();
  for (let i = 0; i < 100000; i++) {
    ellipse(Math.random() * width, 200, 10, 10);
  }
  endTime = performance.now();
  console.log(
    "Math.random() * width took " + (endTime - startTime) + " milliseconds.",
    startTime,
    endTime
  );

  noLoop();
}
