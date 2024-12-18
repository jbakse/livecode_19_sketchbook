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
let sides;
while (true) {
  const start = findUncheckedRegion();
  if (!start) break;
  const type = sample(start.x, start.y).type;
  console.log(`Found '${type}' region at: ${start.x}, ${start.y}`);
  sides = [];
  const result = flood(start.x, start.y, type);
  console.log(result);

  const sideCount = countSides(sides);
  const bulkPrice = sideCount * result.area;
  console.log("Side count:", sideCount, "Bulk Price:", bulkPrice);
  total += bulkPrice;
}
console.log("Total: " + total);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function countSides(sides) {
  const xy = (a, b) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  };

  const yx = (a, b) => {
    if (a.x === b.x) {
      return a.y - b.y;
    }
    return a.x - b.x;
  };

  let sideCount = 0;
  {
    const norths = sides.filter((s) => s.side === "north");
    norths.sort(xy);
    // console.log("norths", norths);
    const previousLoc = { x: false, y: false };
    for (const loc of norths) {
      if (loc.y !== previousLoc.y || loc.x !== previousLoc.x + 1) sideCount++;
      previousLoc.x = loc.x;
      previousLoc.y = loc.y;
    }
    // console.log(sideCount);
  }

  {
    const easts = sides.filter((s) => s.side === "east");
    easts.sort(yx);
    // console.log("easts", easts);
    const previousLoc = { x: false, y: false };
    for (const loc of easts) {
      if (loc.x !== previousLoc.x || loc.y !== previousLoc.y + 1) sideCount++;
      previousLoc.x = loc.x;
      previousLoc.y = loc.y;
    }
    // console.log(sideCount);
  }

  {
    const souths = sides.filter((s) => s.side === "south");
    souths.sort(xy);
    // console.log("souths", souths);
    const previousLoc = { x: false, y: false };
    for (const loc of souths) {
      if (loc.y !== previousLoc.y || loc.x !== previousLoc.x + 1) sideCount++;
      previousLoc.x = loc.x;
      previousLoc.y = loc.y;
    }
    // console.log(sideCount);
  }

  {
    const wests = sides.filter((s) => s.side === "west");
    wests.sort(yx);

    const previousLoc = { x: false, y: false };
    for (const loc of wests) {
      if (loc.x !== previousLoc.x || loc.y !== previousLoc.y + 1) sideCount++;
      previousLoc.x = loc.x;
      previousLoc.y = loc.y;
    }
    // console.log(sideCount);
  }

  return sideCount;
}

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

  // mark sides
  if (sample(x, y - 1).type !== type) sides.push({ x, y, side: "north" });
  if (sample(x + 1, y).type !== type) sides.push({ x, y, side: "east" });
  if (sample(x, y + 1).type !== type) sides.push({ x, y, side: "south" });
  if (sample(x - 1, y).type !== type) sides.push({ x, y, side: "west" });

  let area = 1;
  let perimeter = 0;

  const north = flood(x, y - 1, type);
  area += north.area;
  perimeter += north.perimeter;
  //   if (north.perimeter === 1) sides.push({ x, y, side: "north" });

  const east = flood(x + 1, y, type);
  area += east.area;
  perimeter += east.perimeter;
  //   if (east.perimeter === 1) sides.push({ x, y, side: "east" });

  const south = flood(x, y + 1, type);
  area += south.area;
  perimeter += south.perimeter;
  //   if (south.perimeter === 1) sides.push({ x, y, side: "south" });

  const west = flood(x - 1, y, type);
  area += west.area;
  perimeter += west.perimeter;
  //   if (west.perimeter === 1) sides.push({ x, y, side: "west" });

  return { area, perimeter, price: area * perimeter };
}

function sample(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return { type: "VOID", visited: false };
  }
  return map[y][x];
}
