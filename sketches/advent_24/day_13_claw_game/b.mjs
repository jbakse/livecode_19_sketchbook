/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data_test.txt", "utf8");
// console.log("Input");
// console.log(input);

const machines = input.split("\n\n");

const boost = 10000000000000;

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
      x: parseInt(lines[2].match(/\d+/gu)[0], 10) + boost,
      y: parseInt(lines[2].match(/\d+/gu)[1], 10) + boost,
    },
  };
}

let total = 0;
for (const machine of machines) {
  console.log("\nMachine");
  console.log(machine);

  const bases = getBases(machine);
  const result = checkBases(bases, machine);

  if (result) {
    console.log(result);
    total += result.cost;
  } else {
    console.log("Impossible");
  }
}

/**
 * notes
 *
 * certainly don't need n^2 right, the inner loop an be just division of rmaining distancem.
 *
 * we can determine if a solution is impossible by goal/gcd(a, b)
 * if we can find one answer, the others can probably be found quickly
 * if we find one wrong but close answer, can we use it to find the right one?
 *
 */

console.log("\n\nTotal", total);

function checkBases(bases, machine) {
  const cheapest = { cost: Infinity, aPresses: 0, bPresses: 0 };

  for (const base of bases) {
    const xRepeats = machine.prize.x / base.x;
    const yRepeats = machine.prize.y / base.y;

    if (xRepeats === yRepeats && xRepeats % 1 === 0) {
      const aPresses = base.aPresses * xRepeats;
      const bPresses = base.bPresses * xRepeats;
      const cost = aPresses * machine.a.cost + bPresses * machine.b.cost;
      if (cost < cheapest.cost) {
        cheapest.cost = cost;
        cheapest.aPresses = aPresses;
        cheapest.bPresses = bPresses;
      }
    }
  }

  if (cheapest.cost === Infinity) return false;
  return cheapest;
}

// find the resulting location for xApresses and yBpresses for x = [0...100]
function getBases(machine) {
  const bases = [];

  for (let aPresses = 0; aPresses < 94 * 22; aPresses++) {
    for (let bPresses = 0; bPresses < 94 * 22; bPresses++) {
      const aX = aPresses * machine.a.x;
      const aY = aPresses * machine.a.y;
      const bX = bPresses * machine.b.x;
      const bY = bPresses * machine.b.y;

      // we've found an aPresses,bPresses pair that works for X + Y

      bases.push({ aPresses, bPresses, x: aX + bX, y: aY + bY });
    }
  }
  return bases;
}

function brute(machine) {
  const cheapest = { cost: Infinity, aPresses: 0, bPresses: 0 };

  for (
    let aPresses = Math.floor(machine.prize.x / machine.a.x);
    aPresses >= 0;
    aPresses--
  ) {
    console.log(
      "aPresses",
      aPresses,
      aPresses * machine.a.x,
      machine.prize.x - aPresses * machine.a.x
    );
    break;
    const aX = aPresses * machine.a.x;
    const aY = aPresses * machine.a.y;
    if (aX > machine.prize.x || aY > machine.prize.y) break;

    // find remaining distance
    const remainingX = machine.prize.x - aX;
    const remainingY = machine.prize.y - aY;

    // check how many presses we neeed, make sure both x and y land
    // make sure its integer
    const neededBxs = remainingX / machine.b.x;
    const neededBys = remainingY / machine.b.y;
    if (neededBxs !== neededBys) continue;
    if (neededBxs % 1 !== 0) continue;
    const bPresses = neededBxs;

    const cost = aPresses * machine.a.cost + bPresses * machine.b.cost;
    if (cost < cheapest.cost) {
      cheapest.cost = cost;
      cheapest.aPresses = aPresses;
      cheapest.bPresses = bPresses;
    }
  }

  if (cheapest.cost === Infinity) return false;
  return cheapest;
}

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
