/* eslint-disable no-loop-func */
/* eslint-disable no-constant-condition */
/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 9b");

// read file that has two numbers per line
import fs from "fs";
// current script directory

const diskMap = fs
  .readFileSync(import.meta.dirname + "/data.txt", "utf8")
  .split("")
  .map((v) => parseInt(v, 10));
console.log("Disk Map");
console.log(diskMap);

let mapLeft = 0;
let mapRight = diskMap.length - 1;
if (mapRight % 2 > 0) mapRight -= 1;

let disk = [];

// build initial disk
while (true) {
  const spaceType = ["file", "space"][mapLeft % 2];
  const spaceSize = diskMap[mapLeft];
  console.log(mapLeft, spaceType, spaceSize);
  if (spaceType === "file") {
    const fileId = mapLeft / 2;
    times(spaceSize, () => {
      disk.push(fileId);
    });
  }

  if (spaceType === "space") {
    times(spaceSize, () => {
      disk.push(".");
    });
  }

  mapLeft++;
  if (mapLeft > mapRight) {
    break;
  }
}

console.log("Initial Disk");
console.log(disk.join(""));

while (mapRight > 0) {
  const fileId = mapRight / 2;
  const fileSize = diskMap[mapRight];
  console.log("File", fileId, fileSize);
  // const space = times(fileSize, () => ".").join("");
  // const spaceAt = disk.join("").indexOf(space);
  // const currentlyAt = disk.join("").indexOf(fileId);
  const spaceAt = findSubarrayIndex(
    disk,
    times(fileSize, () => ".")
  );
  const currentlyAt = disk.findIndex((v) => v === fileId);

  if (spaceAt > -1 && spaceAt < currentlyAt) {
    console.log("Space at", spaceAt, currentlyAt);
    disk = disk.map((v) => (v === fileId ? "." : v));
    disk.splice(spaceAt, fileSize, ...times(fileSize, () => fileId));
  }
  //console.log(disk.join(""));
  mapRight -= 2;
}

// calc checksum
const checksum = disk.reduce((acc, v, i) => {
  if (v === ".") return acc;
  return acc + v * i;
}, 0);
console.log("Checksum", checksum);
// 6362722604045

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
// 9801.95ms

function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}

// if there is room for file 4, why wasn't there room for file 6?

function findSubarrayIndex(array, subarray) {
  // Return -1 if the subarray is empty
  if (subarray.length === 0) return -1;

  // Iterate through the main array
  for (let i = 0; i <= array.length - subarray.length; i++) {
    // Check if the slice of the main array matches the subarray
    if (
      array
        .slice(i, i + subarray.length)
        .every((val, index) => val === subarray[index])
    ) {
      return i; // Return the starting index of the subarray
    }
  }

  // If no match is found, return -1
  return -1;
}
