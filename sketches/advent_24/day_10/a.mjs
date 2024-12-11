/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 10a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");

const map = input
  .split("\n")
  .map((line) => line.split("").map((v) => parseInt(v, 10)));

const trailheads = [];
for (const [y, row] of map.entries()) {
  for (const [x, value] of row.entries()) {
    if (map[y][x] === 0) trailheads.push({ x, y });
  }
}
console.log("Trailheads", trailheads);

let total = 0;
for (const trailhead of trailheads) {
  console.log("Trailhead", trailhead);
  const score = climb(trailhead).size;
  console.log("Score", score);
  total += score;
}

console.log("Total", total);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

/// functions
function climb(location) {
  const currentHeight = sample(location);
  if (currentHeight === 9) {
    // return location of this summit in array
    return [JSON.stringify(location)];
  }

  const summits = new Set();
  const north = { x: location.x, y: location.y - 1 };
  if (sample(north) === currentHeight + 1) {
    addAll(summits, climb(north));
  }
  const east = { x: location.x + 1, y: location.y };
  if (sample(east) === currentHeight + 1) {
    addAll(summits, climb(east));
  }
  const south = { x: location.x, y: location.y + 1 };
  if (sample(south) === currentHeight + 1) {
    addAll(summits, climb(south));
  }
  const west = { x: location.x - 1, y: location.y };
  if (sample(west) === currentHeight + 1) {
    addAll(summits, climb(west));
  }
  return summits;
}

/// Utility functions
function addAll(set, newSet) {
  newSet.forEach((v) => set.add(v));
}
function sample({ x, y }) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return 0;
  }
  return map[y][x];
}
