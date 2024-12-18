/**
 * improves a_clean by using a map to store visited positions
 * this improves performance 400x for the large map
 *
 */

/* eslint-disable radix */
/* globals Deno */
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

import { banner, info, log, warn, error } from "../library/logger.ts";

banner("Advent of Code: Day 16b");

/// parse the map
const input = await Deno.readTextFile(import.meta.dirname + "/data_test1.txt");
const map = input.split("\n").map((line) => line.split(""));
const mapWidth = map[0].length;
const mapHeight = map.length;
console.log();
log(render(map, true, true));

/// find start + end
const startPosition = {
  x: input.indexOf("S") % (mapWidth + 1), // +1 for the newline
  y: Math.floor(input.indexOf("S") / (mapWidth + 1)),
  facing: "E",
};

console.log();
log("Start: ", startPosition);

const endPosition = {
  x: input.indexOf("E") % (mapWidth + 1), // +1 for the newline
  y: Math.floor(input.indexOf("E") / (mapWidth + 1)),
};

log("End: ", endPosition);

/// start timer
const startTime = performance.now();

/// search
// finds the lowest cost to reach every position on the map
// returns map of positions x#y#facing -> cost

function search(map, start) {
  const visited = new Map();
  const queue = [];
  queue.push({ ...start, cost: 0 });
  visited.set(`${start.x}#${start.y}#${start.facing}`, 0);

  while (queue.length > 0) {
    const { x, y, facing, cost } = queue.shift();
    pushIfBetter({ x, y, facing: rotateCW(facing), cost: cost + 1000 });
    pushIfBetter({ x, y, facing: rotateCCW(facing), cost: cost + 1000 });

    const result = move(x, y, facing);
    if (result) {
      pushIfBetter({ x: result.x, y: result.y, facing, cost: cost + 1 });
    }
  }

  return visited;

  function pushIfBetter({ x, y, facing, cost }) {
    // if its a wall, don't push
    if (get(map, x, y) === "#") return;

    // if we've already found lower cost path to this position, don't push
    const key = `${x}#${y}#${facing}`;
    if (visited.has(key) && visited.get(key) <= cost) return;

    // add the new one to queue for future searching and visited set
    queue.push({ x, y, facing, cost });
    visited.set(key, cost);
  }
}

const positions = search(map, startPosition);
console.log();
// log("Positions", positions);

/// find the lowest cost position on ending tile

const lowestCost = Math.min(
  positions.get(`${endPosition.x}#${endPosition.y}#N`),
  positions.get(`${endPosition.x}#${endPosition.y}#E`),
  positions.get(`${endPosition.x}#${endPosition.y}#S`),
  positions.get(`${endPosition.x}#${endPosition.y}#W`)
);

console.log();
log("Lowest Cost: ", lowestCost);
//? data_test1.txt 7036 - 3ms -> 1.5ms
//? data_test2.txt 11048 - 4ms -> 2ms
//? data.txt 93436 - 14826ms -> 33ms

/// find the number of visited positions

//! this one doesn't work!
function backtrack(positions, x, y) {
  const visited = new Set();
  const queue = [];
  queue.push({ x, y });
  visited.add(`${x}#${y}`);

  while (queue.length > 0) {
    // get the frontier position
    const { x, y } = queue.shift();
    console.log(x, y);

    // check in all directions if there was a tile that led here
    // from north
    if (
      !visited.has(`${x}#${y - 1}`) &&
      positions.get(`${x}#${y - 1}#S`) <= lowestCost
    ) {
      queue.push({ x, y: y - 1 });
      visited.add(`${x}#${y - 1}`);
    }
    // from east
    if (
      !visited.has(`${x + 1}#${y}`) &&
      positions.get(`${x + 1}#${y}#W`) <= lowestCost
    ) {
      queue.push({ x: x + 1, y });
      visited.add(`${x + 1}#${y}`);
    }

    // from south
    if (
      !visited.has(`${x}#${y + 1}`) &&
      positions.get(`${x}#${y + 1}#N`) <= lowestCost
    ) {
      queue.push({ x, y: y + 1 });
      visited.add(`${x}#${y + 1}`);
    }
    // from west
    if (
      !visited.has(`${x - 1}#${y}`) &&
      positions.get(`${x - 1}#${y}#E`) <= lowestCost
    ) {
      queue.push({ x: x - 1, y });
      visited.add(`${x - 1}#${y}`);
    }

    console.log("q", queue);
  }
  return visited;
}

console.log(positions);

const bestPositions = backtrack(positions, endPosition.x, endPosition.y);

console.log();
log("Best Positions: ", bestPositions.size);

console.log(bestPositions);

for (const position of bestPositions) {
  const [x, y] = position.split("#");
  set(map, parseInt(x), parseInt(y), "X");
}

log(render(map, true, true));

//? data_sm.txt 7
//? data_test1.txt 45
//? data_test2.txt 64
//? data.txt 486

/// stop clock and report time
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

//
//
//
/// facing utilities
// utility functions for working with compass directions and x,y coordinates
function rotateCW(facing) {
  const facings = ["N", "E", "S", "W"];
  return facings[(facings.indexOf(facing) + 1) % 4];
}

function rotateCCW(facing) {
  const facings = ["N", "E", "S", "W"];
  return facings[(facings.indexOf(facing) + 3) % 4];
}

function move(x, y, facing) {
  let newX = x;
  let newY = y;
  if (facing === "N") newY--;
  if (facing === "E") newX++;
  if (facing === "S") newY++;
  if (facing === "W") newX--;
  return { x: newX, y: newY };
}

/// Map Functions
// utility functions for working with 2D[y][x] maps
function render(map, showInfo = false, highlight = false) {
  const width = map[0].length;
  const height = map.length;
  const header = `Map: ${width}x${height}\n`;

  let mapText = map.map((row) => row.join("")).join("\n");
  if (highlight) {
    mapText = mapText
      .replaceAll("#", colors.red("#"))
      .replaceAll(".", colors.gray("."))
      .replaceAll("S", colors.bgWhite("S"))
      .replaceAll("E", colors.bgWhite("E"));
  }
  return showInfo ? header + mapText : mapText;
}

function get(map, x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return false;
  }
  return map[y][x];
}

function set(map, x, y, value) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  map[y][x] = value;
  return true;
}
