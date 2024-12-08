/* eslint-disable radix */
console.log("Advent of Code 2024 - Day 7b");

import fs from "fs";
const input = fs.readFileSync("day_7_data.txt", "utf8");

const tests = input
  .split("\n")
  .map((line) => line.split(":"))
  .map((test) => [
    parseInt(test[0]),
    test[1]
      .trim()
      .split(" ")
      .map((x) => parseInt(x)),
  ]);

console.log(tests);

const startTime = performance.now();
let testNumber = 0;
let total = 0;
for (const test of tests) {
  console.log(`\nTest ${++testNumber} / ${tests.length}`);

  const result = testTest(test);
  if (result) total += Number.parseInt(test[0], 10);

  console.log(result ? "PASS" : "FAIL");
}
console.log(`time: ${performance.now() - startTime}ms`);
// 339ms

console.log("total", total);
// 1026766857276279

function testTest(test) {
  const target = test[0];
  const operands = test[1];
  if (operands.length === 1) return operands[0] === target;

  // try +
  {
    const operands = [...test[1]];
    operands[0] += operands[1];
    operands.splice(1, 1);
    // if (operands[0] > target) return false;
    // ^ doesn't work for + case for some reason

    if (testTest([target, operands])) return true;
  }
  // try *
  {
    const operands = [...test[1]];
    operands[0] *= operands[1];
    operands.splice(1, 1);
    if (operands[0] > target) return false;
    if (testTest([target, operands])) return true;
  }
  // try concat
  {
    const operands = [...test[1]];
    operands[0] = parseInt(`${operands[0]}${operands[1]}`);
    operands.splice(1, 1);
    if (operands[0] > target) return false;
    if (testTest([target, operands])) return true;
  }

  return false;
}

// suggestion from r/adventofcode
// go right to left. start with the result, undo each operation
// you immediately find branches that can't work
