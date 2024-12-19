/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable radix */
/* globals Deno */
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

import { banner, info, log, warn, error } from "../library/logger.ts";

banner("Advent of Code: Day 19a");

const input = await Deno.readTextFile(import.meta.dirname + "/data.txt");

const towels = input.split("\n\n")[0].split(", ");
log("towels: ", towels);

const designs = input.split("\n\n")[1].split("\n");
log("designs: ", designs);

const startTime = performance.now();

let solveableCount = 0;
for (const design of designs) {
  console.log();
  log("design: ", design);
  const result = solve(design, towels);
  log("result: ", result);
  if (result) solveableCount++;
}

console.log();
log("solveableCount: ", solveableCount);

const endTime = performance.now();
console.log(`\n\ntime: ${(endTime - startTime).toFixed(2)}ms`);

function solve(design, towels) {
  if (!solve.memo) solve.memo = new Map();
  const memoKey = design;
  if (solve.memo.has(memoKey)) return solve.memo.get(memoKey);

  if (design === "") return true;
  for (const towel of towels) {
    if (design.startsWith(towel) && solve(design.slice(towel.length), towels)) {
      solve.memo.set(memoKey, true);
      return true;
    }
  }

  solve.memo.set(memoKey, false);
  return false;
}
