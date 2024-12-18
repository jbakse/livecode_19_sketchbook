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

  const A = machine.a.x;
  const B = machine.b.x;
  const C = machine.prize.x;

  const D = machine.a.y;
  const E = machine.b.y;
  const F = machine.prize.y;

  let aPresses = (C - (1 / E) * B * F) / (A - (1 / E) * B * D);
  let bPresses = (F - (1 / A) * D * C) / (E - (1 / A) * B * D);

  aPresses = roundIfClose(aPresses); // floating point round errors actualy strike!
  bPresses = roundIfClose(bPresses);

  console.log("aPresses", aPresses, Number.isInteger(aPresses));
  console.log("bPresses", bPresses, Number.isInteger(bPresses));

  if (Number.isInteger(aPresses) && Number.isInteger(bPresses)) {
    total += aPresses * machine.a.cost + bPresses * machine.b.cost;
  }
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

function roundIfClose(value, threshold = 0.001) {
  const nearest = Math.round(value);
  return Math.abs(value - nearest) < threshold ? nearest : value;
}
