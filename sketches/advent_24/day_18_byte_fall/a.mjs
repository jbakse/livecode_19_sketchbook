/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable radix */
/* globals Deno */
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

import { banner, info, log, warn, error } from "../library/logger.ts";

banner("Advent of Code: Day 17a");

/// parse input
const input = await Deno.readTextFile(import.meta.dirname + "/data.txt");
// console.log("Input");
// console.log(input);

const locations = input.split("\n").map((line) => {
  const loc = {};
  [loc.x, loc.y] = line.split(",");
  return loc;
});

/// make map
const map = array2D(71, 71, ".");

for (let i = 0; i < 1024; i++) {
  set(map, locations[i].x, locations[i].y, "#");
}
console.log();
log(render(map, true, true));

const startTime = performance.now();

/// bfs

function search(map, start) {
  const queue = [];
  queue.push({ ...start, cost: 0 });
  const visited = new Map();
  visited.set(`${start.x}#${start.y}`, {
    cost: 0,
    fromX: false,
    fromY: false,
  });

  while (queue.length > 0) {
    const { x, y, cost } = queue.shift();
    pushIfBetter({ x: x + 0, y: y - 1, cost: cost + 1, fromX: x, fromY: y });
    pushIfBetter({ x: x + 1, y: y + 0, cost: cost + 1, fromX: x, fromY: y });
    pushIfBetter({ x: x + 0, y: y + 1, cost: cost + 1, fromX: x, fromY: y });
    pushIfBetter({ x: x - 1, y: y + 0, cost: cost + 1, fromX: x, fromY: y });
  }

  return visited;

  function pushIfBetter({ x, y, cost, fromX, fromY }) {
    // if its a wall, don't push
    if (get(map, x, y) === "#") return;
    if (get(map, x, y) === false) return;

    // if we've already found lower cost path to this position, don't push
    const key = `${x}#${y}`;
    if (visited.has(key) && visited.get(key).cost <= cost) return;

    // add the new one to queue for future searching and visited set
    queue.push({ x, y, cost, fromX, fromY });
    visited.set(key, { cost, fromX, fromY });
  }
}

const positions = search(map, { x: 0, y: 0 });
// console.log(positions);

/// walk bath the path
function walkBack(positions, x, y) {
  const path = [];
  while (true) {
    const key = `${x}#${y}`;
    const pos = positions.get(key);
    path.push({ x, y });
    if (pos.fromX === false) return path;
    x = pos.fromX;
    y = pos.fromY;
  }
}

const path = walkBack(positions, 70, 70);
// console.log(path);

for (const location of path) {
  set(map, location.x, location.y, "O");
}

console.log();
log(render(map, true, true));

console.log();
console.log("Path length: ", path.length);
console.log("Steps: ", path.length - 1);

const endTime = performance.now();

console.log();
console.log();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

function array2D(cols, rows, value) {
  const a = [];
  for (let col = 0; col < cols; col++) {
    a.push([]);
    for (let row = 0; row < rows; row++) {
      a[col][row] = value;
    }
  }
  return a;
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
