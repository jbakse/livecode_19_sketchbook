/* eslint-disable no-labels */
/* eslint-disable prefer-template */
/* globals process */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");
// console.log("Input");
// console.log(input);

const [mapPart, movesPart] = input.split("\n\n");

const wideMap = mapPart
  .replaceAll(".", "..")
  .replaceAll("#", "##")
  .replaceAll("O", "[]")
  .replaceAll("@", "@.");

const map = wideMap.split("\n").map((line) => line.split(""));
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

console.log("\nStarting Map");
console.log(renderMap());

const DRY = true;
const NOTDRY = false;

/// move bot
for (const direction of directions) {
  console.log(`Move: ${direction}`);
  const canMove = tryMove(botX, botY, direction, DRY);
  if (canMove) {
    console.log("can move");
    tryMove(botX, botY, direction, NOTDRY);
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
    if (cell === "[") {
      total += y * 100 + x;
    }
  }
}

console.log("Total: ", total);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function tryMove(x, y, direction, dry = DRY) {
  if ("@[]".indexOf(get(x, y)) === -1) {
    throw new Error(
      `can only try to move bots and boxes ${x}, ${y} = ${get(
        x,
        y
      )}. dry: ${dry}`
    );
  }

  if (direction === "^") {
    // if wall, we are blocked
    if (get(x, y - 1) === "#") return false;

    // if left side of box, try to move it and the right side
    if (get(x, y - 1) === "[") {
      if (!tryMove(x, y - 1, direction, dry)) return false;
      if (!tryMove(x + 1, y - 1, direction, dry)) return false;
    }

    if (get(x, y - 1) === "]") {
      if (!tryMove(x, y - 1, direction, dry)) return false;
      if (!tryMove(x - 1, y - 1, direction, dry)) return false;
    }

    // do the move
    if (!dry) doMove(x, y, 0, -1);
    // if (!dry) doMove(x + 1, y, 0, -1);

    return true;
  }

  if (direction === "<") {
    // if wall, we are blocked
    if (get(x - 1, y) === "#") return false;

    // if box, try to move it
    if (get(x - 1, y) === "[" || get(x - 1, y) === "]") {
      if (!tryMove(x - 1, y, direction, dry)) return false;
    }

    // do the move
    if (!dry) doMove(x, y, -1, 0);

    return true;
  }

  if (direction === "v") {
    // if wall, we are blocked
    if (get(x, y + 1) === "#") return false;

    // if left side of box, try to move it and the right side
    if (get(x, y + 1) === "[") {
      if (!tryMove(x, y + 1, direction, dry)) return false;
      if (!tryMove(x + 1, y + 1, direction, dry)) return false;
    }

    if (get(x, y + 1) === "]") {
      if (!tryMove(x, y + 1, direction, dry)) return false;
      if (!tryMove(x - 1, y + 1, direction, dry)) return false;
    }

    // do the move
    if (!dry) doMove(x, y, 0, +1);
    // if (!dry) doMove(x + 1, y, 0, -1);

    return true;
  }

  if (direction === ">") {
    // if wall, we are blocked
    if (get(x + 1, y) === "#") return false;

    // if box, try to move it
    if (get(x + 1, y) === "[" || get(x + 1, y) === "]") {
      if (!tryMove(x + 1, y, direction, dry)) return false;
    }

    // do the move
    if (!dry) doMove(x, y, +1, 0);

    return true;
  }

  throw new Error("Unsupported move: " + direction);
}

function doMove(x, y, dX, dY) {
  // if we are moving the bot set the botx, boty
  if (get(x, y) === "@") {
    botX = x + dX;
    botY = y + dY;
  }
  // move whatever is here to the destination
  set(x + dX, y + dY, get(x, y));
  // and set here to empty space
  set(x, y, ".");
}

// // blocked by wall
// const [dx, dy] = getDxDy(direction);
// if (get(x + dx, y + dy) === "#") {
//   return false;
// }

// // if destination is a box, try to move it
// if (get(x + dx, y + dy) === "O") {
//   if (!tryMove(x + dx, y + dy, direction)) {
//     return false;
//   }
// }

// // at this point, the destination should always be empty, just check defensively
// if (get(x + dx, y + dy) !== ".") {
//   throw new Error(
//     `Expected ${x + dx}, ${y + dy} to be empty, but found ${get(
//       x + dx,
//       y + dy
//     )}`
//   );
// }

// // if we are moving the bot set the botx, boty
// if (get(x, y) === "@") {
//   botX = x + dx;
//   botY = y + dy;
// }
// // move whatever is here to the destination
// set(x + dx, y + dy, get(x, y));
// // and set here to empty space
// set(x, y, ".");
// return true;

// function getDxDy(direction) {
//   let dx;
//   let dy;
//   switch (direction) {
//     case "^":
//       [dx, dy] = [0, -1];
//       break;
//     case ">":
//       [dx, dy] = [1, 0];
//       break;
//     case "v":
//       [dx, dy] = [0, 1];
//       break;
//     case "<":
//       [dx, dy] = [-1, 0];
//       break;
//     default:
//       [dx, dy] = [0, 0];
//       throw new Error("Unknown move: " + direction);
//   }
// }

function render() {
  return map.map((row) => row.join("")).join("\n");
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
