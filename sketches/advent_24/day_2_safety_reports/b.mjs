// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync("day_2_data.txt", "utf8");
const lines = input.split("\n");

// turn the file into a multidimensional array of numbers
const reports = lines.map((line) =>
  line.split(/\s+/u).map((n) => parseInt(n, 10))
);

const dampenedReports = reports.map((row) => {
  const variations = [row];
  for (let i = 0; i < row.length; i++) {
    const copy = [...row];
    copy.splice(i, 1);
    variations.push(copy);
  }
  return variations;
});

function getDeltas(a) {
  const deltas = [];
  for (let i = 0; i < a.length - 1; i++) {
    deltas.push(a[i + 1] - a[i]);
  }
  return deltas;
}

let passCount = 0;

/*eslint no-labels: "off"*/
for (const reportSet of dampenedReports) {
  console.log("reportSet", reportSet);
  for (const report of reportSet) {
    const deltas = getDeltas(report);
    const increasing = deltas.every((d) => d > 0);
    const decreasing = deltas.every((d) => d < 0);
    const inRange = deltas.every((d) => Math.abs(d) >= 1 && Math.abs(d) <= 3);
    console.log(
      increasing,
      decreasing,
      inRange,
      (increasing || decreasing) && inRange ? "PASS" : "FAIL"
    );
    if ((increasing || decreasing) && inRange) {
      passCount += 1;
      break;
    }
  }
}

console.log(passCount);
