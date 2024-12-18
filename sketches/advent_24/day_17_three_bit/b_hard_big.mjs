/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable radix */
/* globals Deno BigInt*/
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

import { banner, info, log, warn, error } from "../library/logger.ts";

banner("Advent of Code: Day 17b");

const input = await Deno.readTextFile(import.meta.dirname + "/data.txt");
console.log("Input");
console.log(input);

/// parse input
const parsed = {
  // find integer in input.split("\n")[0]
  a: parseInt(input.split("\n")[0].match(/\d+/u)[0]),
  b: parseInt(input.split("\n")[1].match(/\d+/u)[0]),
  c: parseInt(input.split("\n")[2].match(/\d+/u)[0]),
  program: input
    .split("\n")[4]
    .split(" ")[1]
    .split(",")
    .map((x) => parseInt(x)),
};

log("parsed", parsed);

/// start timer
const startTime = performance.now();

/// compute

function compute(a, b, c) {
  const output = [];

  let steps = 0;
  while (++steps < 17) {
    //  console.log([a, b, c]);

    // 2(4=A) bst
    b = BigInt(a) % 8n; // throw out all but last three bits
    // b = a & 0b0111;

    // 1(1=1) bxl
    b = BigInt(b) ^ 1n; // even goes up, odd goes down

    // 7(5=B) cdv
    // c = Math.floor(a / 2 ** b);
    c = BigInt(a) >> BigInt(b);

    // 0(3=3) adv
    // a = Math.floor(a / 2 ** 3);
    a = BigInt(a) >> 3n;

    // 1(4=A) bxl
    b = BigInt(b) ^ 4n;

    // 4(0=0) bxc
    b = BigInt(b) ^ BigInt(c);

    // 5(5=B) out
    output.push(b % 8n);
    // console.log("output", b % 8);

    // 3(3=3) jnz
    if (a === 0n) break;
  }
  return output;
}

const result = compute(parsed.a, parsed.b, parsed.c);
console.log("result", result);

let testA = (25294588544325n << 3n) - 0n;
const stepSize = 1n;
let steps = 0;
while (steps++ < 9) {
  // if (testA % 1_000_000 === 0) console.log("testA", testA);
  const result = compute(testA, BigInt(parsed.b), BigInt(parsed.c));
  console.log("testA", testA, "result", result.join(","));

  testA += stepSize;
}

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

// testA 5n result 0
// testA 46n result 3,0
// testA 368n result 5,3,0
// testA 2944n result 5,5,3,0
// testA 23557n result 0,5,5,3,0
// testA 188459n result 4,0,5,5,3,0
// testA 1507674n result 4,4,0,5,5,3,0
// testA 12061399n result 1,4,4,0,5,5,3,0
// testA 96491197n result 3,1,4,4,0,5,5,3,0
// testA 771929582n result 0,3,1,4,4,0,5,5,3,0
// testA 6175436656n result 5,0,3,1,4,4,0,5,5,3,0
// testA 49403493250n result 7,5,0,3,1,4,4,0,5,5,3,0
// testA 395227946004n result 1,7,5,0,3,1,4,4,0,5,5,3,0
// ? had to go 9 steps?
// testA 3161823568040n result 1,1,7,5,0,3,1,4,4,0,5,5,3,0
// testA 25294588544325n result 4,1,1,7,5,0,3,1,4,4,0,5,5,3,0
// testA 202356708354602n result 2,4,1,1,7,5,0,3,1,4,4,0,5,5,3,0
//

// testA 12061392 result  5,4,4,0,5,5,3,0
// testA 96491136 result  5,5,4,4,0,5,5,3,0
// testA 771929582 result 0,3,1,4,4,0,5,5,3,0
