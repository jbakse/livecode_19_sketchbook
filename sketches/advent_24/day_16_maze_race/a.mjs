/* eslint-disable no-labels */
/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 16a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data_test1.txt", "utf8");
console.log("Input");
console.log(input);

const map = input.split("\n").map((line) => line.split(""));
// console.log(map);

const bot = {
  x: 0,
  y: 0,
  facing: "E",
};

/// find bot
outer: for (const [y, row] of map.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === "S") {
      //   set(x, y, ".");
      bot.x = x;
      bot.y = y;
      break outer;
    }
  }
}

// console.log("Map: ", map);
console.log("Bot: ", bot);

const visited = [];
const queue = [];
queue.push({ x: bot.x, y: bot.y, facing: bot.facing, cost: 0 });
visited.push({ x: bot.x, y: bot.y, facing: bot.facing, cost: 0 });

let best = Infinity;
let steps = 0;
while (queue.length > 0) {
  const { x, y, facing, cost } = queue.shift();
  console.log(x, y, facing, cost);

  pushIfBetter({ x, y, facing: rotateCW(facing), cost: cost + 1000 });
  pushIfBetter({ x, y, facing: rotateCCW(facing), cost: cost + 1000 });

  const result = move(x, y, facing);
  if (result) {
    pushIfBetter({ x: result.x, y: result.y, facing, cost: cost + 1 });
  }

  ++steps;
  //   if (++steps >= 100) break;
}

console.log("Steps", steps);
console.log("Best", best);

function pushIfBetter({ x, y, facing, cost }) {
  if (get(x, y) === "#") {
    throw new Error(`tried to move into wall ${x}, ${y}, ${facing}`);
  }

  // find any matching positions
  const matchIndex = visited.findIndex(
    (item) => item.x === x && item.y === y && item.facing === facing
  );
  const match = visited[matchIndex];

  // something better exists, just return
  if (match && match.cost <= cost) return;

  if (get(x, y) === "E") {
    console.log("Found exit at ", x, y, facing, cost);
    if (cost < best) {
      best = cost;
    }
  }

  // add the new one
  queue.push({ x, y, facing, cost });
  visited.push({ x, y, facing, cost });

  // if there is a (worse) match, remove it
  if (match) visited.splice(matchIndex, 1);
}

function rotateCW(facing) {
  switch (facing) {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
    default:
      throw new Error("Invalid facing: " + facing);
  }
}

function rotateCCW(facing) {
  return rotateCW(rotateCW(rotateCW(facing)));
}

function move(x, y, facing) {
  let newX = x;
  let newY = y;
  switch (facing) {
    case "N":
      newY--;
      break;
    case "E":
      newX++;
      break;
    case "S":
      newY++;
      break;
    case "W":
      newX--;
      break;
    default:
      throw new Error("Invalid facing: " + facing);
  }

  if (get(newX, newY) === "#") {
    return false;
  }

  return { x: newX, y: newY };
}

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function get(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return false;
  }
  return map[y][x];
}

function set(x, y, value) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return;
  map[y][x] = value;
}
