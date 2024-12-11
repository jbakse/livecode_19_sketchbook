/* eslint-disable prefer-template */

/// added memoization to climb function, didn't do much

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
// console.log("Trailheads", trailheads);

let total = 0;
for (const trailhead of trailheads) {
  // console.log("Trailhead", trailhead);
  const score = climb(trailhead);
  // console.log("Score", score);
  total += score;
}

console.log(climb.memo);
console.log("Total", total);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

/// functions

function climb(location) {
  if (!climb.memo) climb.memo = new Map();

  const memoKey = `${location.x}_${location.y}`;
  if (climb.memo.has(memoKey)) return climb.memo.get(memoKey);

  const currentHeight = sample(location);
  if (currentHeight === 9) {
    // return location of this summit in array
    climb.memo.set(memoKey, 1);
    return 1;
  }

  let score = 0;
  const north = { x: location.x, y: location.y - 1 };
  const east = { x: location.x + 1, y: location.y };
  const south = { x: location.x, y: location.y + 1 };
  const west = { x: location.x - 1, y: location.y };

  for (const direction of [north, east, south, west]) {
    if (sample(direction) === currentHeight + 1) {
      score += climb(direction);
    }
  }

  climb.memo.set(memoKey, score);
  return score;
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
