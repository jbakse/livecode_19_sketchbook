/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day 13a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data.txt", "utf8");
// console.log("Input");
// console.log(input);

const machines = input.split("\n\n");

for (const [index, machine] of machines.entries()) {
  const lines = machine.split("\n");

  machines[index] = {
    a: {
      x: parseInt(lines[0].match(/\d+/gu)[0], 10),
      y: parseInt(lines[0].match(/\d+/gu)[1], 10),
      cost: 3,
    },
    b: {
      x: parseInt(lines[1].match(/\d+/gu)[0], 10),
      y: parseInt(lines[1].match(/\d+/gu)[1], 10),
      cost: 1,
    },
    prize: {
      x: parseInt(lines[2].match(/\d+/gu)[0], 10),
      y: parseInt(lines[2].match(/\d+/gu)[1], 10),
    },
  };
}

let total = 0;
for (const machine of machines) {
  console.log("Machine");
  console.log(machine);

  const result = brute(machine);
  if (result.cost !== Infinity) {
    total += result.cost;
  }
}

console.log("Total", total);

function brute(machine) {
  const cheapest = { cost: Infinity, aPresses: 0, bPresses: 0 };

  for (let aPresses = 0; aPresses <= 100; aPresses++) {
    for (let bPresses = 0; bPresses <= 100; bPresses++) {
      const cost = aPresses * machine.a.cost + bPresses * machine.b.cost;
      const x = aPresses * machine.a.x + bPresses * machine.b.x;
      const y = aPresses * machine.a.y + bPresses * machine.b.y;
      if (x === machine.prize.x && y === machine.prize.y) {
        // console.log("Found", { aPresses, bPresses, cost });
        if (cost < cheapest.cost) {
          cheapest.cost = cost;
          cheapest.aPresses = aPresses;
          cheapest.bPresses = bPresses;
        }
      }
    }
  }
  return cheapest;
}

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
