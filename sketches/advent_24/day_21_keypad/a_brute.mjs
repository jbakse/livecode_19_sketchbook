/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable radix */
/* globals Deno */
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

// import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

// import { banner, info, log, warn, error } from "../library/logger.ts";
// import { assertEquals } from "https://deno.land/std@0.110.0/testing/asserts.ts";

const log = console.log;

// banner("Advent of Code: Day 21a");
// const input = await Deno.readTextFile(import.meta.dirname + "/input.txt");
import fs from "fs";
const input = fs.readFileSync("day_21_keypad/input.txt", "utf8");

const codes = input.split("\n");

const numericLayout = [
  //
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["#", "0", "A"],
];

const directionalLayout = [
  //
  ["#", "^", "A"],
  ["<", "v", ">"],
];

class Bot {
  constructor(layout) {
    this.layout = layout;
    this.reset();
  }

  reset() {
    const { x, y } = locationOf(this.layout, "A");
    this.x = x;
    this.y = y;
  }

  sequencesForCode(code) {
    const parts = code.split("").map((value) => this.pathsTo(value));
    const combos = cartesianProduct(parts);
    const paths = combos.map((combo) => combo.flat().join(""));
    return paths;
  }

  // returns array of paths from current position to the position of `value`
  pathsTo(value) {
    const { x: targetX, y: targetY } = locationOf(this.layout, value);
    const paths = this._pathsTo(value, this.x, this.y);
    this.x = targetX;
    this.y = targetY;
    return paths;
  }

  _pathsTo(value, x, y) {
    const { x: targetX, y: targetY } = locationOf(this.layout, value);

    // if we are already there, there is one solution: don't move, press the button.
    if (targetX === x && targetY === y) return [["A"]];

    // we should never be out of bounds
    if (get(this.layout, x, y) === false) {
      throw new Error("bot out of bounds");
    }

    // if we get to a buttonless spot, there are no paths from there.
    if (get(this.layout, x, y) === "#") {
      return [];
    }

    const paths = [];
    // north
    if (y > targetY)
      paths.push(
        ...this._pathsTo(value, x, y - 1).map((path) => ["^", ...path])
      );

    // east
    if (x < targetX)
      paths.push(
        ...this._pathsTo(value, x + 1, y).map((path) => [">", ...path])
      );

    // south
    if (y < targetY)
      paths.push(
        ...this._pathsTo(value, x, y + 1).map((path) => ["v", ...path])
      );

    // west
    if (x > targetX)
      paths.push(
        ...this._pathsTo(value, x - 1, y).map((path) => ["<", ...path])
      );

    return paths;
  }
}

let total = 0;
for (const code of codes) {
  log("\n\ncode", code);
  const keypadBot = new Bot(numericLayout);
  keypadBot.reset();
  const sequences = keypadBot.sequencesForCode(code);
  log("keypad sequences", sequences.length);

  const bot2 = new Bot(directionalLayout);
  const bot2sequences = [];
  for (const sequence of sequences) {
    bot2.reset();
    bot2sequences.push(...bot2.sequencesForCode(sequence));
  }

  log("bot2 sequences", bot2sequences.length);

  const bot3 = new Bot(directionalLayout);
  const bot3sequences = [];
  for (const sequence of bot2sequences) {
    bot3.reset();
    bot3sequences.push(...bot3.sequencesForCode(sequence));
  }

  log("bot3 sequences", bot3sequences.length);

  // get the length of the shortest sequence
  const shortestLength = bot3sequences.reduce(
    (acc, curr) => (curr.length < acc ? curr.length : acc),
    Infinity
  );
  console.log("shortest", shortestLength);
  const numeric = Number.parseInt(code);
  console.log("numeric", numeric);
  console.log("complexity", shortestLength * numeric);

  total += shortestLength * numeric;
}

console.log("total", total);

// node --watch  --stack-size=65500 day_21_keypad/a.mjs
// 805A - 57960
// 964A - 69408
// 459A - 33966
// 968A - 67760
// 671A - 49654
// 278748

// finds every combination of one item from each array in `arrays`
function cartesianProduct(arrays) {
  return arrays.reduce(
    (acc, curr) => {
      return acc.flatMap((a) => curr.map((b) => [...a, b]));
    },
    [[]]
  );
}

// returns the x, y position of `value` in the 2d array `a`
function locationOf(a, value) {
  for (let y = 0; y < a.length; y++) {
    const x = a[y].indexOf(value);
    if (x >= 0) return { x, y };
  }
  return false;
}

const startTime = performance.now();
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

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

// Deno.test(
//   "locationOf should return correct position for existing value",
//   () => {
//     const layout = [
//       ["7", "8", "9"],
//       ["4", "5", "6"],
//       ["1", "2", "3"],
//       ["#", "0", "A"],
//     ];

//     assertEquals(locationOf(layout, "5"), { x: 1, y: 1 });
//     assertEquals(locationOf(layout, "A"), { x: 2, y: 3 });
//     assertEquals(locationOf(layout, "#"), { x: 0, y: 3 });
//   }
// );
