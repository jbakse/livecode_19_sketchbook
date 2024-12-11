console.log("Advent of Code 2024 - Day 6a");

import fs from "fs";
const input = fs.readFileSync("day_6_data.txt", "utf8");

const map = input.split("\n").map((s) => s.split(""));

// deep freeze the map
map.forEach((row) => Object.freeze(row));
Object.freeze(map);

// console.log("map", map);

const UP = "UP";
const RIGHT = "RIGHT";
const DOWN = "DOWN";
const LEFT = "LEFT";

const guard = {
  x: 0,
  y: 0,
  direction: UP,
};

for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    if (sample(map, col, row) === "^") {
      guard.x = col;
      guard.y = row;
    }
  }
}

console.log("guard", guard);

async function testMap(map, guard) {
  map = structuredClone(map);
  guard = structuredClone(guard);
  let steps = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    map[guard.y][guard.x] = "X";
    const { x, y, direction } = guard;
    const { nextX, nextY, isBlocked, isExit } = nextBlocked(
      map,
      x,
      y,
      direction
    );
    if (isBlocked) {
      turn(guard);
      continue;
    }

    if (isExit) {
      return "exited";
    }

    guard.x = nextX;
    guard.y = nextY;

    if (++steps > map.length * map[0].length) {
      return "looped";
    }

    //console.clear();
    //console.log(map.map((row) => row.join("")).join("\n"));
    // eslint-disable-next-line no-await-in-loop
    // await new Promise((r) => {
    //   setTimeout(r, 1);
    // });
  }
}

const start = performance.now();
let loopCount = 0;
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    if (sample(map, col, row) === "^") continue;

    const mapCopy = structuredClone(map);
    mapCopy[row][col] = "#";
    // eslint-disable-next-line no-await-in-loop
    const result = await testMap(mapCopy, guard);
    // console.log("result", result);

    if (result === "looped") {
      loopCount++;
      // console.log("loopCount", loopCount);
    }

    // eslint-disable-next-line no-await-in-loop
    // await new Promise((r) => {
    //   setTimeout(r, 10);
    // });
  }
}

const end = performance.now();

console.log("took", end - start, "ms");
console.log("loopCount", loopCount);

function turn(guard) {
  switch (guard.direction) {
    case UP:
      guard.direction = RIGHT;
      break;
    case RIGHT:
      guard.direction = DOWN;
      break;
    case DOWN:
      guard.direction = LEFT;
      break;
    case LEFT:
      guard.direction = UP;
      break;
    default:
      break;
  }
}

function nextBlocked(map, currentX, currentY, direction) {
  let nextX = currentX;
  let nextY = currentY;
  if (direction === UP) {
    nextY--;
  }
  if (direction === RIGHT) {
    nextX++;
  }
  if (direction === DOWN) {
    nextY++;
  }
  if (direction === LEFT) {
    nextX--;
  }

  const isBlocked = sample(map, nextX, nextY) === "#";
  const isExit = sample(map, nextX, nextY) === false;

  return { isExit, isBlocked, nextX, nextY };
}

function sample(map, x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  return map[y][x];
}
