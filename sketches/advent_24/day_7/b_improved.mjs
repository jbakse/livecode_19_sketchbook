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
// 145017ms
console.log("total", total);
// 1026766857276279

function testTest([target, _operands]) {
  target = Number.parseInt(target, 10);
  console.log(`${target}: ${_operands}`);

  // eslint-disable-next-line no-label-var, no-labels
  tests: for (let i = 0; i < 4 ** (_operands.length - 1); i++) {
    const operands = [..._operands];
    let result = operands.shift();
    let equation = `${result}`;
    for (const [oIndex, operand] of Object.entries(operands)) {
      // eslint-disable-next-line no-bitwise
      const operator = ["+", "*", "+''+", "BAD"][(i >> (oIndex * 2)) & 3];
      // eslint-disable-next-line no-labels
      if (operator === "BAD") continue tests;
      equation += ` ${operator} ${operand}`;
      // eslint-disable-next-line no-eval
      result = eval(`${result} ${operator} ${operand}`);
      result = Number.parseInt(result, 10);
      // eslint-disable-next-line no-labels
      if (result > target) continue tests;
      // result can only get bigger, so we can bail if we get too big
    }
    if (result === target) {
      console.log(equation, "->", result);
      return true;
    }
  }
  return false;
}

// suggestion from r/adventofcode
// go right to left. start with the result, undo each operation
// you immediately find branches that can't work
