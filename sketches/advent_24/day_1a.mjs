console.log("Advent of Code: Day 1");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync("day_1_data.txt", "utf8");
const lines = input.split("\n");

// make list of left and list of right numbers
const leftNumbers = [];
const rightNumbers = [];
lines.forEach((line) => {
  // split on whitespace, parse numbers
  const [l, r] = line.split(/\s+/u).map((n) => parseInt(n, 10));
  leftNumbers.push(l);
  rightNumbers.push(r);
});

// sort both lists
leftNumbers.sort((a, b) => a - b);
rightNumbers.sort((a, b) => a - b);

// find difference between each pair of numbers
const differences = [];
for (let i = 0; i < leftNumbers.length; i++) {
  const diff = Math.abs(rightNumbers[i] - leftNumbers[i]);
  differences.push(diff);
}
console.log(differences);

// return sum of all differences
const total = differences.reduce((a, b) => a + b, 0);
console.log(total);
