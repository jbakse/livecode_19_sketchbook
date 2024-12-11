/* eslint-disable no-loop-func */
/* eslint-disable no-constant-condition */
/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

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

const disk = [];

// pack disk
while (true) {
  const spaceType = ["file", "space"][mapLeft % 2];
  const spaceSize = diskMap[mapLeft];
  console.log(mapLeft, spaceType, spaceSize);
  if (spaceType === "file") {
    const fileId = mapLeft / 2;
    times(spaceSize, () => {
      disk.push(fileId);
    });
    // console.log(disk.join(""));
  }

  if (spaceType === "space") {
    times(spaceSize, () => {
      const fileId = mapRight / 2;
      const fileSize = diskMap[mapRight];
      disk.push(fileId);
      diskMap[mapRight]--; // lower file size
      if (diskMap[mapRight] === 0) {
        // if filesize reaches 0 move to next file
        mapRight -= 2;
      }
    });
    // console.log(disk.join(""));
  }

  mapLeft++;
  if (mapLeft > mapRight) {
    break;
  }
}

// calc checksum
const checksum = disk.reduce((acc, v, i) => acc + v * i, 0);

console.log("Checksum", checksum);
// 6337921897505

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
// 72.73ms

function times(t, f) {
  const a = [];
  for (let i = 0; i < t; i++) {
    a.push(f(i));
  }
  return a;
}
