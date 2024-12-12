/* eslint-disable no-constant-condition */
/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 12a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");
console.log("Input");
console.log(input);

const map = input
  .split("\n")
  .map((line) => line.split("").map((c) => ({ type: c, visited: false })));

let total = 0;
while (true) {
  const start = findUncheckedRegion();
  if (!start) break;
  const type = sample(start.x, start.y).type;
  console.log(`Found '${type}' region at: ${start.x}, ${start.y}`);
  const result = flood(start.x, start.y, type);
  console.log(result);
  total += result.price;
}
console.log("Total: " + total);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function findUncheckedRegion() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (sample(x, y).visited === false) {
        return { x, y };
      }
    }
  }
  return null;
}

function flood(x, y, type) {
  if (sample(x, y).type === type && sample(x, y).visited === true) {
    return { area: 0, perimeter: 0 };
  }
  if (sample(x, y).type !== type) {
    return { area: 0, perimeter: 1 };
  }

  map[y][x].visited = true;

  let area = 1;
  let perimeter = 0;
  const north = flood(x, y - 1, type);
  area += north.area;
  perimeter += north.perimeter;
  const east = flood(x + 1, y, type);
  area += east.area;
  perimeter += east.perimeter;
  const south = flood(x, y + 1, type);
  area += south.area;
  perimeter += south.perimeter;
  const west = flood(x - 1, y, type);
  area += west.area;
  perimeter += west.perimeter;

  return { area, perimeter, price: area * perimeter };
}

function sample(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return { type: "VOID", visited: false };
  }
  return map[y][x];
}
