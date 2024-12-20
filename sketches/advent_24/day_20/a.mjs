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

const input = await Deno.readTextFile(import.meta.dirname + "/input.txt");

/// parse the map
const map = input.split("\n").map((line) => line.split(""));
const mapWidth = map[0].length;
const mapHeight = map.length;
console.log();
log(render(map, true, true));

/// find start + end
const startPosition = {
  x: input.indexOf("S") % (mapWidth + 1), // +1 for the newline
  y: Math.floor(input.indexOf("S") / (mapWidth + 1)),
};

console.log();
log("Start: ", startPosition);

const endPosition = {
  x: input.indexOf("E") % (mapWidth + 1), // +1 for the newline
  y: Math.floor(input.indexOf("E") / (mapWidth + 1)),
};

log("End: ", endPosition);

/// find the path
function search(map, start) {
  const queue = [];
  queue.push({ ...start, cost: 0 });
  const visited = new Map();

  const shortcuts = [];

  visited.set(`${start.x}#${start.y}`, {
    cost: 0,
    fromX: false,
    fromY: false,
  });

  while (queue.length > 0) {
    const { x, y, cost } = queue.shift();
    findShortcuts(x, y, cost, visited);
    pushIfBetter({ x: x + 0, y: y - 1, cost: cost + 1, fromX: x, fromY: y });
    pushIfBetter({ x: x + 1, y: y + 0, cost: cost + 1, fromX: x, fromY: y });
    pushIfBetter({ x: x + 0, y: y + 1, cost: cost + 1, fromX: x, fromY: y });
    pushIfBetter({ x: x - 1, y: y + 0, cost: cost + 1, fromX: x, fromY: y });
  }

  return [visited, shortcuts];

  function findShortcuts(x, y, cost, visited) {
    // north
    if (get(map, x, y - 1) === "#" && visited.has(`${x}#${y - 2}`)) {
      const { cost: fromCost } = visited.get(`${x}#${y - 2}`);
      shortcuts.push({
        fromX: x,
        fromY: y - 2,
        toX: x,
        toY: y,
        fromCost,
        toCost: cost,
      });
    }
    // east
    if (get(map, x + 1, y) === "#" && visited.has(`${x + 2}#${y}`)) {
      const { cost: fromCost } = visited.get(`${x + 2}#${y}`);
      shortcuts.push({
        fromX: x + 2,
        fromY: y,
        toX: x,
        toY: y,
        fromCost,
        toCost: cost,
      });
    }
    // south
    if (get(map, x, y + 1) === "#" && visited.has(`${x}#${y + 2}`)) {
      const { cost: fromCost } = visited.get(`${x}#${y + 2}`);
      shortcuts.push({
        fromX: x,
        fromY: y + 2,
        toX: x,
        toY: y,
        fromCost,
        toCost: cost,
      });
    }
    // west
    if (get(map, x - 1, y) === "#" && visited.has(`${x - 2}#${y}`)) {
      const { cost: fromCost } = visited.get(`${x - 2}#${y}`);
      shortcuts.push({
        fromX: x - 2,
        fromY: y,
        toX: x,
        toY: y,
        fromCost,
        toCost: cost,
      });
    }
  }
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

let [visited, shortcuts] = search(map, {
  x: startPosition.x,
  y: startPosition.y,
});

/// calculate savings
shortcuts = shortcuts.map((s) => ({
  ...s,
  savings: s.toCost - s.fromCost - 2,
}));

let count = 0;
for (const shortcut of shortcuts) {
  if (shortcut.savings >= 100) {
    count++;
  }
}

log("count", count);

const startTime = performance.now();
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

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
