/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

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
      x: parseInt(lines[2].match(/\d+/gu)[0], 10) + 10000000000000,
      y: parseInt(lines[2].match(/\d+/gu)[1], 10) + 10000000000000,
    },
  };
}

let total = 0;

console.log("uh", inspectAXBY(67, -7, -2));

for (const machine of machines) {
  console.log("\n\nMachine");
  console.log(machine);
  if (machine.a.x / machine.a.y === machine.b.x / machine.b.y) {
    console.log("Parallel");
  } else {
    console.log("Not Parallel");
  }

  // find the first aPresses, bPresses pair that works on the x axis
  const xWorks0 = inspectAXBY(machine.a.x, machine.b.x, machine.prize.x);
  if (!xWorks0) {
    console.log("No solution for x");
    continue;
  }
  console.log("xWorks0", xWorks0);
  const xWorks0Loc = {
    x: machine.a.x * xWorks0.x + machine.b.x * xWorks0.y,
    y: machine.a.y * xWorks0.x + machine.b.y * xWorks0.y,
  };
  console.log("xWorks0Loc", xWorks0Loc);

  // find the second
  const xWorks1 = solutionK(xWorks0, 1);
  console.log("xWorks1", xWorks1);
  const xWorks1Loc = {
    x: machine.a.x * xWorks1.x + machine.b.x * xWorks1.y,
    y: machine.a.y * xWorks1.x + machine.b.y * xWorks1.y,
  };
  console.log("xWorks1Loc", xWorks1Loc);

  // find which solution we need
  const k = (machine.prize.y - xWorks0Loc.y) / (xWorks1Loc.y - xWorks0Loc.y);
  console.log("k", k);
  if (!Number.isInteger(k)) {
    console.log("k not integer");
    continue;
  }

  // find the solution
  const xWorksK = solutionK(xWorks0, k);
  console.log("xWorksK", xWorksK);
  const xWorksKLoc = {
    x: machine.a.x * xWorksK.x + machine.b.x * xWorksK.y,
    y: machine.a.y * xWorksK.x + machine.b.y * xWorksK.y,
  };
  console.log("xWorksKLoc", xWorksKLoc);

  console.log("Solution Found");
  total += xWorksK.x * machine.a.cost + xWorksK.y * machine.b.cost;
}
console.log("Total", total);
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

/**
 * finds a solution {x, y} for the equation ax + by = c
 * where a,b,x,y,c are non-negative integers
 * finds the solution with the lowest non-negative x
 * returns false if impossible
 */
function inspectAXBY(a, b, c) {
  const searchMax = Math.abs(a * b);
  for (let x = 0; x < searchMax; x++) {
    const y = (c - a * x) / b;
    if (Number.isInteger(y)) {
      // console.log("Solution", { x, y });
      return { a, b, c, x, y };
    }
  }
  // console.log("Impossible");
  return false;
}

/**
 * given values a,x,b,y,c where ax + by = c
 * and k
 * returns other solutions k away from the first solution
 */
function solutionK(solution, k) {
  const { a, x, b, y, c } = solution;
  if (b < 0) k = -k;
  const g = gcd(a, b);
  const xk = x + k * (b / g);
  const yk = y - k * (a / g);
  return { a, b, c, x: xk, y: yk };
}

// https://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}
