/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 11a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");

const stones = input.split(" ").map(Number);
console.log("Stones");
console.log(stones);

let newStones = [...stones];
const blinks = 75;

for (let blink = 0; blink < blinks; blink++) {
  for (const [index, value] of newStones.entries()) {
    // rule 1: if the number is 0, it becomes 1
    if (value === 0) {
      newStones[index] = 1;
      continue;
    }

    // rule 2: if the number of digits is even, split the number in half
    const stringLength = (value + "").length;
    if (stringLength % 2 === 0) {
      newStones[index] = [
        // first half of string
        Number(value.toString().slice(0, stringLength / 2)),
        // second half of string
        Number(value.toString().slice(stringLength / 2)),
      ];
      continue;
    }

    // rule 3: otherwise  multiply it by 2024
    newStones[index] = value * 2024;
  }
  newStones = newStones.flat();
  console.log(`Blink ${blink + 1}`);
  console.log(newStones);
}

console.log("Result");
console.log(newStones.length);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
