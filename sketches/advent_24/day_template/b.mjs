/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?b");

// read file that has two numbers per line
import fs from "fs";
// current script directory

const input = fs.readFileSync(import.meta.dirname + "/data_test.txt", "utf8");
console.log("Input");
console.log(input);

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
