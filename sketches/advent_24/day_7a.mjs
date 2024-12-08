console.clear();

console.log("Advent of Code 2024 - Day 7a");

import fs from "fs";
const input = fs.readFileSync("day_7_data.txt", "utf8");

const tests = input
  .split("\n")
  .map((line) => line.split(":"))
  .map((test) => [test[0], test[1].trim().split(" ")]);

console.log(tests);

// eslint-disable-next-line no-unreachable-loop
let total = 0;
let testNumber = 0;
for (const test of tests) {
  const result = testTest(test);
  if (result) total += Number.parseInt(test[0], 10);

  console.log(
    `test ${++testNumber} / ${tests.length}: ${result ? "PASS" : "FAIL"}`
  );

  console.log();
}

console.log("total", total);

function testTest([target, _operands]) {
  target = Number.parseInt(target, 10);
  console.log("target", target);
  console.log("operands", _operands);
  for (let i = 0; i < 2 ** (_operands.length - 1); i++) {
    const operands = [..._operands];
    let result = operands.shift();
    let equation = `${result}`;
    for (const [oIndex, operand] of Object.entries(operands)) {
      // eslint-disable-next-line no-bitwise
      const operator = ["+", "*"][(i >> oIndex) & 1];
      equation += ` ${operator} ${operand}`;
      // eslint-disable-next-line no-eval
      result = eval(`${result} ${operator} ${operand}`);
    }
    console.log(equation, "->", result);
    if (result === target) {
      return true;
    }
  }
  return false;
}
