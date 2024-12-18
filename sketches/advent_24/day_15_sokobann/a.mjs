/* eslint-disable no-labels */
/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");
console.log("Input");
console.log(input);

const [mapPart, movesPart] = input.split("\n\n");
const map = mapPart.split("\n").map((line) => line.split(""));
// console.log(map);

const directions = movesPart.split("\n").join("").split("");
// console.log(directions);

let botX;
let botY;

/// find bot
outer: for (const [y, row] of map.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === "@") {
      //   set(x, y, ".");
      botX = x;
      botY = y;
      break outer;
    }
  }
}

/// move bot
for (const direction of directions) {
  //   console.log(`Move: ${direction}`);
  const moved = tryMove(botX, botY, direction);
  if (moved) {
    console.log(`${direction}: Moved bot to ${botX}, ${botY}`);
  } else {
    console.log(`${direction}: Blocked`);
  }
  console.log(renderMap());
}

/// calc map score

let total = 0;
for (const [y, row] of map.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === "O") {
      total += y * 100 + x;
    }
  }
}

console.log("Total: ", total);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function renderMap() {
  return map.map((row) => row.join("")).join("\n");
}
function tryMove(x, y, direction) {
  if (!(get(x, y) !== "@" || get(x, y) !== "O")) {
    throw new Error("can only try to move bots and boxes");
  }

  let dx;
  let dy;
  switch (direction) {
    case "^":
      [dx, dy] = [0, -1];
      break;
    case ">":
      [dx, dy] = [1, 0];
      break;
    case "v":
      [dx, dy] = [0, 1];
      break;
    case "<":
      [dx, dy] = [-1, 0];
      break;
    default:
      [dx, dy] = [0, 0];
      throw new Error("Unknown move: " + direction);
  }

  // blocked by wall
  if (get(x + dx, y + dy) === "#") {
    return false;
  }

  // if destination is a box, try to move it
  if (get(x + dx, y + dy) === "O") {
    if (!tryMove(x + dx, y + dy, direction)) {
      return false;
    }
  }

  // at this point, the destination should always be empty, just check defensively
  if (get(x + dx, y + dy) !== ".") {
    throw new Error(
      `Expected ${x + dx}, ${y + dy} to be empty, but found ${get(
        x + dx,
        y + dy
      )}`
    );
  }

  // if we are moving the bot set the botx, boty
  if (get(x, y) === "@") {
    botX = x + dx;
    botY = y + dy;
  }
  // move whatever is here to the destination
  set(x + dx, y + dy, get(x, y));
  // and set here to empty space
  set(x, y, ".");
  return true;
}

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

// switch (direction) {
//     case "^":
//       direction(0, -1);
//       break;
//     case ">":
//       direction(1, 0);
//       break;
//     case "v":
//       direction(0, 1);
//       break;
//     case "<":
//       direction(-1, 0);
//       break;
//     default:
//       console.log("Unknown move: " + direction);
//   }
