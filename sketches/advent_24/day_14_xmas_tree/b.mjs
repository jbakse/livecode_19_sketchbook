/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");
// console.log("Input");
// console.log(input);
const lines = input.split("\n");

const robots = lines.map((line) => ({
  x: parseInt(line.match(/-?\d+/gu)[0], 10),
  y: parseInt(line.match(/-?\d+/gu)[1], 10),
  dX: parseInt(line.match(/-?\d+/gu)[2], 10),
  dY: parseInt(line.match(/-?\d+/gu)[3], 10),
}));

const width = 101;
const height = 103;
const steps = 100;

let steppedRobots = robots.map((r) => stepRobot(r, 7338));

for (let i = 0; i < 1000000; i++) {
  // console.log("i", i);
  steppedRobots = steppedRobots.map((r) => stepRobot(r, 0));

  let lines = "";
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const rs = steppedRobots.filter((r) => r.x === x && r.y === y);
      line += rs.length === 0 ? " " : rs.length;
    }
    lines += line + "\n";
  }

  console.log(lines);
  console.log(i);
  // eslint-disable-next-line no-await-in-loop
  // await sleep(200);
  // wait for key press
  await waitForKeypress();
}

function waitForKeypress() {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true); // Enables raw mode to read a single character
    process.stdin.resume(); // Resume the stdin stream
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false); // Disable raw mode after the keypress
      process.stdin.pause(); // Pause the stdin stream
      resolve();
    });
  });
}

// 66 + 71 * 101 = 7237

// interesting  | 66 167 268 369
// interesting --- 128 231 334

// console.log(robots);
// console.log(steppedRobots);

// const q1 = countRobots(
//   steppedRobots,
//   0,
//   0,
//   Math.floor(width / 2) - 1,
//   Math.floor(height / 2) - 1
// );

// const q2 = countRobots(
//   steppedRobots,
//   Math.floor(width / 2) + 1,
//   0,
//   width,
//   Math.floor(height / 2) - 1
// );

// const q3 = countRobots(
//   steppedRobots,
//   0,
//   Math.floor(height / 2) + 1,
//   Math.floor(width / 2) - 1,
//   height
// );

// const q4 = countRobots(
//   steppedRobots,
//   Math.floor(width / 2) + 1,
//   Math.floor(height / 2) + 1,
//   width,
//   height
// );

// console.log("Q1", q1);
// console.log("Q2", q2);
// console.log("Q3", q3);
// console.log("Q4", q4);

// console.log("Answer", q1 * q2 * q3 * q4);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function countRobots(robots, x1, y1, x2, y2) {
  // console.log(x1, y1, x2, y2);
  const rs = robots.filter(
    (r) => r.x >= x1 && r.x <= x2 && r.y >= y1 && r.y <= y2
  );
  // console.log(rs);
  return rs.length;
}

function stepRobot(robot, steps) {
  return {
    x: mod(robot.x + robot.dX * steps, width),
    y: mod(robot.y + robot.dY * steps, height),
    dX: robot.dX,
    dY: robot.dY,
  };
}

function mod(a, b) {
  return ((a % b) + b) % b;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function lcmArray(arr) {
  return arr.reduce(lcm);
}

function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}
