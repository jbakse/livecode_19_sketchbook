console.log("Advent of Code 2024 - Day 4a");

// load data
import fs from "fs";
const input = fs.readFileSync("day_4_data.txt", "utf8");
const lines = input.split("\n");

const width = lines[0].length;
const height = lines.length;

let count = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    // check up
    if (
      sample(x, y) === "X" &&
      sample(x, y - 1) === "M" &&
      sample(x, y - 2) === "A" &&
      sample(x, y - 3) === "S"
    ) {
      count++;
    }

    // check up right
    if (
      sample(x, y) === "X" &&
      sample(x + 1, y - 1) === "M" &&
      sample(x + 2, y - 2) === "A" &&
      sample(x + 3, y - 3) === "S"
    ) {
      count++;
    }

    // check right
    if (
      sample(x, y) === "X" &&
      sample(x + 1, y) === "M" &&
      sample(x + 2, y) === "A" &&
      sample(x + 3, y) === "S"
    ) {
      count++;
    }

    // check down right
    if (
      sample(x, y) === "X" &&
      sample(x + 1, y + 1) === "M" &&
      sample(x + 2, y + 2) === "A" &&
      sample(x + 3, y + 3) === "S"
    ) {
      count++;
    }

    // check down
    if (
      sample(x, y) === "X" &&
      sample(x, y + 1) === "M" &&
      sample(x, y + 2) === "A" &&
      sample(x, y + 3) === "S"
    ) {
      count++;
    }

    // check down left
    if (
      sample(x, y) === "X" &&
      sample(x - 1, y + 1) === "M" &&
      sample(x - 2, y + 2) === "A" &&
      sample(x - 3, y + 3) === "S"
    ) {
      count++;
    }

    // check left
    if (
      sample(x, y) === "X" &&
      sample(x - 1, y) === "M" &&
      sample(x - 2, y) === "A" &&
      sample(x - 3, y) === "S"
    ) {
      count++;
    }

    // check up left
    if (
      sample(x, y) === "X" &&
      sample(x - 1, y - 1) === "M" &&
      sample(x - 2, y - 2) === "A" &&
      sample(x - 3, y - 3) === "S"
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
