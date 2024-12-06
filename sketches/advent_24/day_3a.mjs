/*eslint prefer-named-capture-group: "off"*/
// read file that has two numbers per line
import fs from "fs";
let input = fs.readFileSync("day_3_data.txt", "utf8");
const lines = input.split("\n");
input = lines.join(" ");

console.log(input);

// find all the substrings matching  mul\(\d\d?\d?,\d\d?\d?\)
const matches = input.match(/mul\(\d\d?\d?,\d\d?\d?\)/gu);

console.log(matches);

let sum = 0;

for (const match of matches) {
  const [_, a, b] = match.match(/mul\((\d\d?\d?),(\d\d?\d?)\)/u);
  console.log(match, a, b);
  sum += a * b;
}

console.log(sum);
