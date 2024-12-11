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

let score = 0;
leftNumbers.forEach((l) => {
  // count how many times l appears in rightNumbers
  const count = rightNumbers.filter((r) => r === l).length;

  // add l * count to score (cause thats what the challenge says to do)
  score += l * count;
});

console.log(score);
