console.log("Advent of Code 2024 - Day 4b");

// load data
import fs from "fs";
const input = fs.readFileSync("day_4_data.txt", "utf8");
const lines = input.split("\n");

const width = lines[0].length;
const height = lines.length;

let count = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const backslashForward =
      sample(x - 1, y - 1) === "M" &&
      sample(x, y) === "A" &&
      sample(x + 1, y + 1) === "S";

    const backslashBackward =
      sample(x - 1, y - 1) === "S" &&
      sample(x, y) === "A" &&
      sample(x + 1, y + 1) === "M";

    const slashForward =
      sample(x - 1, y + 1) === "M" &&
      sample(x, y) === "A" &&
      sample(x + 1, y - 1) === "S";

    const slashBackward =
      sample(x - 1, y + 1) === "S" &&
      sample(x, y) === "A" &&
      sample(x + 1, y - 1) === "M";

    if (
      (backslashForward || backslashBackward) &&
      (slashForward || slashBackward)
    ) {
      count++;
    }
  }
}

console.log(count);

function sample(x, y) {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return false;
  }
  try {
    return lines[y][x];
  } catch (error) {
    console.log(`error reading x: ${x}, y: ${y}`);
    throw error;
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
