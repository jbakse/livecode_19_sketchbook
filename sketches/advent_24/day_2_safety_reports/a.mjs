// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync("day_2_data.txt", "utf8");
const lines = input.split("\n");

// turn the file into a multidimensional array of numbers
const data = lines.map((line) =>
  line.split(/\s+/u).map((n) => parseInt(n, 10))
);

// create an array of the differences between each pair of numbers
const deltas = data.map((row) => {
  const deltas = [];
  for (let i = 0; i < row.length - 1; i++) {
    deltas.push(row[i + 1] - row[i]);
  }
  return deltas;
});

// filter to rows that are all increasing or all decreasing
const check1 = deltas.filter((row) => {
  const increasing = row.every((d) => d > 0);
  const decreasing = row.every((d) => d < 0);
  return increasing || decreasing;
});

// filter to rows where every abs value is between 1 and 3 inclusive
const check2 = check1.filter(
  //
  (row) => row.every((d) => Math.abs(d) >= 1 && Math.abs(d) <= 3)
);

console.log(check2);
console.log(check2.length);
