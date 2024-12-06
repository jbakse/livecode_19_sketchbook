console.log("Advent of Code 2024 - Day 6a");

import fs from "fs";
const input = fs.readFileSync("day_6_data.txt", "utf8");

const map = input.split("\n").map((s) => s.split(""));

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
    if (sample(col, row) === "^") {
      guard.x = col;
      guard.y = row;
    }
  }
}

console.log("guard", guard);

// eslint-disable-next-line no-constant-condition
while (true) {
  map[guard.y][guard.x] = "X";
  const { x, y, direction } = guard;
  const { nextX, nextY, isBlocked, isExit } = nextBlocked(x, y, direction);
  if (isBlocked) {
    turn();
    continue;
  }

  if (isExit) {
    break;
  }

  guard.x = nextX;
  guard.y = nextY;

  // console.clear();
  // console.log(map.join("\n"));
}

console.log("exit");
// count "X" in map

console.log(map.flat().filter((c) => c === "X").length);

function turn() {
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

function nextBlocked(currentX, currentY, direction) {
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

  const isBlocked = sample(nextX, nextY) === "#";
  const isExit = sample(nextX, nextY) === false;

  return { isExit, isBlocked, nextX, nextY };
}

function sample(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  return map[y][x];
}
