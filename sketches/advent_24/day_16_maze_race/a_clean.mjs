/* globals Deno */
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

import { banner, info, log, warn, error } from "../library/logger.ts";

banner("Advent of Code: Day 16a");

/// parse the map
const input = await Deno.readTextFile(import.meta.dirname + "/data.txt");
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
// returns list of positions (x, y, facing, cost)

function search(map, start) {
  const visited = [];
  const queue = [];
  queue.push({ ...start, cost: 0 });
  visited.push({ ...start, cost: 0 });

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
    const matchIndex = visited.findIndex(
      (item) => item.x === x && item.y === y && item.facing === facing
    );
    const match = visited[matchIndex];
    if (match && match.cost <= cost) return;

    // add the new one to queue for future searching and visited list
    queue.push({ x, y, facing, cost });
    visited.push({ x, y, facing, cost });

    // if there is a (worse) match, remove it
    if (match) visited.splice(matchIndex, 1);
  }
}

const positions = search(map, startPosition);
console.log();
// log("Positions", positions);

/// find the lowest cost position on ending tile
const lowestCost = positions.reduce((acc, item) => {
  if (item.x === endPosition.x && item.y === endPosition.y) {
    return Math.min(acc, item.cost);
  }
  return acc;
}, Infinity);

console.log();
log("Lowest Cost: ", lowestCost);
//? data_test1.txt 7036 - 3ms
//? data_test2.txt 11048 - 4ms
//? data.txt 93436 - 14826ms

/// stop clock and report time
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

//
//
//
/// facing utilities
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