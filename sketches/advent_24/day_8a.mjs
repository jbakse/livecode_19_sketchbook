/* eslint-disable guard-for-in */
console.log("Advent of Code 2024 - Day 8a");

import { group } from "console";
import fs from "fs";
const input = fs.readFileSync("day_8_data.txt", "utf8");

// parse the map
const map = input.split("\n").map((s) => s.split(""));

// lock it down so i don't accidently change it
map.forEach((row) => Object.freeze(row));
Object.freeze(map);

// find the antenas
const antenas = [];
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    const freq = map[row][col];
    if (freq !== ".") {
      antenas.push({ row, col, freq });
    }
  }
}

// group the antenas by freq
const groupedAntenas = antenas.reduce((groups, antena) => {
  if (!groups[antena.freq]) {
    groups[antena.freq] = [];
  }
  groups[antena.freq].push(antena);
  return groups;
}, {});

// find pairs
// note that pairs contains each pair both directions, a->b and b->a
const antenaPairs = [];
for (const group of Object.values(groupedAntenas)) {
  for (const a of group) {
    for (const b of group) {
      if (a !== b) {
        antenaPairs.push([a, b]);
      }
    }
  }
}

// find locations of antinodes
const antinodeSet = new Set();

for (const pair of antenaPairs) {
  const [a, b] = pair;
  const rowDiff = a.row - b.row;
  const colDiff = a.col - b.col;
  const antiNode = {
    row: a.row + rowDiff,
    col: a.col + colDiff,
  };

  console.log(a, b, antiNode);

  // ignore antinodes that are out of bounds
  if (antiNode.row < 0) continue;
  if (antiNode.row >= map.length) continue;
  if (antiNode.col < 0) continue;
  if (antiNode.col >= map[0].length) continue;
  antinodeSet.add(JSON.stringify(antiNode));
}

console.log("antinodes", antinodeSet);
console.log("count", antinodeSet.size);
