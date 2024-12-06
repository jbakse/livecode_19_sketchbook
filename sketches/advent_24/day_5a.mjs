console.log("Advent of Code 2024 - Day 5a");

import fs from "fs";
const input = fs.readFileSync("day_5_data.txt", "utf8");

const [rulesString, updatesString] = input.split("\n\n");

const rules = rulesString.split("\n").map((s) => s.split("|"));
console.log("rules");
console.log(rules);

const updates = updatesString.split("\n").map((s) => s.split(","));
console.log("updates");
console.log(updates);

let sum = 0;
for (const update of updates) {
  const legal = isUpdateLegal(update);
  console.log("update", update, "legal", legal);
  if (legal) {
    // get middle item from update
    const middle = update[Math.floor(update.length / 2)];
    sum += Number.parseInt(middle, 10);
  }
}
console.log("sum", sum);

function isUpdateLegal(update) {
  for (const [index, pageNum] of update.entries()) {
    // console.log("checking", index, pageNum);
    const matchedRules = rules.filter((r) => r[0] === pageNum);
    for (const rule of matchedRules) {
      //   console.log("found rule", rule);
      //   console.log("update", update, index, update.slice(0, index));
      const violation = update.slice(0, index).includes(rule[1]);
      if (violation) {
        return false;
      }
    }
  }
  return true;
}
