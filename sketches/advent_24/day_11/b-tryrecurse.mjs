/* eslint-disable no-else-return */
/* eslint-disable no-constant-condition */
/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 11a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");
const stones = input.split(" ").map(Number);
console.log("Stones");
console.log(stones);

//
const targetBlinks = 75;
let total = 0;
for (const stone of stones) {
  const count = stepStone(stone, targetBlinks);
  total += count;
  console.log(`Stone ${stone}: ${count}`);
}
console.log();
console.log("Total", total);

console.log(`Remembered ${stepStone.memo.size} values`);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

// value - value of stone
// steps - how many times to age the stone
// returns number of stones produced

function stepStone(value, steps) {
  if (stepStone.memo === undefined) stepStone.memo = new Map();
  const key = `${value}-${steps}`;
  if (stepStone.memo.has(key)) return stepStone.memo.get(key);

  if (steps === 0) return 1;

  // rule 1: if the number is 0, it becomes 1
  if (value === 0) {
    const count = stepStone(1, steps - 1);
    stepStone.memo.set(key, count);
    return count;
  }

  // rule 2: if the number of digits is even, split the number in half
  else if ((value + "").length % 2 === 0) {
    const stringLength = (value + "").length;
    const count =
      stepStone(
        Number(value.toString().slice(0, stringLength / 2)),
        steps - 1
      ) +
      stepStone(Number(value.toString().slice(stringLength / 2)), steps - 1);

    stepStone.memo.set(key, count);
    return count;
  }

  // rule 3: otherwise  multiply it by 2024
  else {
    const count = stepStone(value * 2024, steps - 1);
    stepStone.memo.set(key, count);
    return count;
  }
}
