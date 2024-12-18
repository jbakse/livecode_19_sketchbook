/* eslint-disable prefer-template */

const startTime = performance.now();

console.log("Advent of Code: Day ?a");

// read file that has two numbers per line
import fs from "fs";
const input = fs.readFileSync(import.meta.dirname + "/data_test_m.txt", "utf8");
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

console.log("uh", inspectAXBY(67, -7, -2));

for (const machine of machines) {
  console.log("\n\nMachine");
  console.log(machine);

  const inspectedX = inspectAXBY(machine.a.x, machine.b.x, machine.prize.x);
  const inspectedY = inspectAXBY(machine.a.y, machine.b.y, machine.prize.y);
  console.log("Inspected X", inspectedX);
  console.log("Inspected Y", inspectedY);

  const baseA = inspectedX.x;
  const baseB = inspectedY.x;
  console.log("Base A", baseA);
  console.log("Base B", baseB);

  const nextX = solutionK(inspectedX, 1);
  const nextY = solutionK(inspectedY, 1);
  // console.log("Next X", nextX);
  // console.log("Next Y", nextY);
  const deltaA = nextX.x - inspectedX.x;
  const deltaB = nextY.x - inspectedY.x;
  console.log("Delta X", deltaA);
  console.log("Delta Y", deltaB);

  const firstSolution = inspectAXBY(deltaA, -deltaB, baseB - baseA);
  console.log("First Solution", firstSolution);
  const firstSX = solutionK(inspectedX, firstSolution.x);
  const firstSY = solutionK(inspectedY, firstSolution.y);
  console.log("First SX", firstSX);
  console.log("First SY", firstSY);

  const nextSolution = solutionK(firstSolution, 1);
  console.log("Next Solution", nextSolution);
  const nextSX = solutionK(inspectedX, nextSolution.x);
  const nextSY = solutionK(inspectedY, nextSolution.y);
  console.log("Next SX", nextSX);
  console.log("Next SY", nextSY);

  console.log(firstSX.y - firstSY.y);
  console.log(nextSX.y - nextSY.y);
  const closingRate = nextSX.y - nextSY.y - (firstSX.y - firstSY.y);
  console.log("Closing Rate", closingRate);
  const solutionID = (firstSX.y - firstSY.y) / closingRate;
  console.log("Solution ID", solutionID);

  {
    const nextSolution = solutionK(firstSolution, -solutionID);
    console.log("Next Solution", nextSolution);
    const nextSX = solutionK(inspectedX, nextSolution.x);
    const nextSY = solutionK(inspectedY, nextSolution.y);
    console.log("!!");
    console.log("Next SX", nextSX);
    console.log("Next SY", nextSY);
  }

  // Next SX { a: 69, b: 27, c: 10000000018641, x: 102851800151, y: 107526881786 }

  // const min = 0;
  // const max = 2 ** 30;
  // let current = max / 2;
  // let step = max / 2;
  // while (step >= 1) {
  //   // console.log("c  ", current);
  //   const solution = solutionK(firstSolution, current);
  //   const a = solutionK(inspectedX, solution.x);
  //   const b = solutionK(inspectedY, solution.y);
  //   // console.log(current, a.y - b.y);
  //   // console.log(a);
  //   // console.log(b);
  //   if (a.y === b.y) {
  //     console.log("!!!!Solution", solution);
  //     console.log("A", a);
  //     console.log("B", b);
  //     break;
  //   }
  //   if (a.y < b.y) {
  //     current -= Math.floor(step / 2);
  //   } else {
  //     current += Math.floor(step / 2);
  //   }
  //   step /= 2;
  // }
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
      console.log("Solution", { x, y });
      return { a, b, c, x, y };
    }
  }
  console.log("Impossible");
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
