/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable radix */
/* globals Deno */
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
    b = a % 8; // throw out all but last three bits
    // b = a & 0b0111;

    // 1(1=1) bxl
    b = (b ^ 0b0001) >>> 0; // even goes up, odd goes down

    // 7(5=B) cdv
    c = Math.floor(a / 2 ** b);
    // c = a >> b;

    // 0(3=3) adv
    a = Math.floor(a / 2 ** 3);
    // a = a >> 3;

    // 1(4=A) bxl
    b = (b ^ 0b0100) >>> 0;

    // 4(0=0) bxc
    b = (b ^ c) >>> 0;

    // 5(5=B) out
    output.push(b % 8);
    // console.log("output", b % 8);

    // 3(3=3) jnz
    if (a === 0) break;
  }
  return output;
}

const result = compute(parsed.a, parsed.b, parsed.c);
console.log("result", result);

let testA = 96491136 << 3;
const stepSize = 1;
let steps = 0;
while (steps++ < 8) {
  // if (testA % 1_000_000 === 0) console.log("testA", testA);
  const result = compute(testA, parsed.b, parsed.c);
  console.log("testA", testA, "result", result.join(","));

  testA += stepSize;
}

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);

// testA 12061392 result  5,4,4,0,5,5,3,0
// testA 96491136 result  5,5,4,4,0,5,5,3,0
// testA 771929582 result 0,3,1,4,4,0,5,5,3,0
