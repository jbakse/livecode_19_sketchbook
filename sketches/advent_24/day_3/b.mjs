/*eslint prefer-named-capture-group: "off"*/
/*eslint prefer-template: "off"*/

// read file that has two numbers per line
import fs from "fs";
let input = fs.readFileSync("day_3_data.txt", "utf8");
const lines = input.split("\n");
input = "do()" + lines.join(" ");

const dont_starts = input.split("don't()");
const stripped = dont_starts.map((line) => {
  // everything after first do()
  const start = line.indexOf("do()");
  if (start === -1) return "";
  return line.slice(start + 4);
});
input = stripped.join(" ");

// find all the substrings matching  mul\(\d\d?\d?,\d\d?\d?\)
const matches = input.match(/mul\(\d\d?\d?,\d\d?\d?\)/gu);

let sum = 0;

for (const match of matches) {
  const [_, a, b] = match.match(/mul\((\d\d?\d?),(\d\d?\d?)\)/u);
  sum += a * b;
}

console.log(sum);
