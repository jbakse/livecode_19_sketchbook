/* eslint-disable no-constant-condition */
/* eslint-disable prefer-template */

import { inspect } from "util";
const startTime = performance.now();

console.log("Advent of Code: Day 11a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data_test.txt", "utf8");

const stones = input
  .split(" ")
  .map(Number)
  .map((v) => ({ v, age: 0 }));

console.log("Stones");
console.log(stones);

const targetBlinks = 6;
while (true) {
  const stone = stones.find((s) => s.age < targetBlinks);
  if (!stone) break;

  const newStones = ageStone(stone);
  // replace stone with newStones
  const index = stones.indexOf(stone);
  stones.splice(index, 1, ...newStones);

  console.log(stones);
}

function ageStone(stone) {
  // rule 1: if the number is 0, it becomes 1
  if (stone.v === 0) return [{ v: 1, age: stone.age + 1 }];

  // rule 2: if the number of digits is even, split the number in half
  const stringLength = (stone.v + "").length;
  if (stringLength % 2 === 0) {
    return [
      // first half of string
      {
        v: Number(stone.v.toString().slice(0, stringLength / 2)),
        age: stone.age + 1,
      },
      // second half of string
      {
        v: Number(stone.v.toString().slice(stringLength / 2)),
        age: stone.age + 1,
      },
    ];
  }

  // rule 3: otherwise  multiply it by 2024
  return [{ v: stone.v * 2024, age: stone.age + 1 }];
}

console.log();
console.log("Result");
console.log(stones.length);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
