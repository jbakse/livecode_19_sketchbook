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

const record = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function compute(a, b, c, program) {
  const startA = a;
  let instructionPointer = 0;
  const output = [];

  let step = 0;
  while (++step < 1_000) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];
    // console.log(
    //   `step ${step}: [${a} ${b} ${c}] ${colors.red(
    //     instructionPointer + ""
    //   )} -> ${opcode}(${operand})`
    // );

    if (opcode === undefined) break;

    /// 0-adv
    if (opcode === 0) {
      const numerator = a;
      const denominator = 2 ** readCombo(operand);
      a = Math.floor(numerator / denominator);
      instructionPointer += 2;
      continue;
    }

    /// 1-blx
    if (opcode === 1) {
      b = (b ^ operand) >>> 0; // xor
      instructionPointer += 2;
      continue;
    }

    /// 2-bst
    if (opcode === 2) {
      b = readCombo(operand) % 8; //? negative numbers might be a problem
      instructionPointer += 2;
      continue;
    }

    /// 3-jnz
    if (opcode === 3) {
      if (a !== 0) {
        instructionPointer = operand;
      } else {
        instructionPointer += 2;
      }
      continue;
    }

    /// 4-bxc
    if (opcode === 4) {
      b = (b ^ c) >>> 0;
      instructionPointer += 2;
      continue;
    }

    /// 5-out
    if (opcode === 5) {
      const value = readCombo(operand) % 8;

      if (program[output.length] !== value) return output;

      output.push(value);

      // const old = record[output.length];
      // const diff = startA - old;
      // record[output.length] = startA;

      // // get log base 2 of diff
      // const log2 = Math.log2(diff);

      // if (output.length >= 14) {
      //   console.log("found digit: ", output.length);
      //   console.log(
      //     "startA",
      //     startA,
      //     output.join(""),
      //     "old",
      //     old,
      //     "diff",
      //     diff,
      //     "log2",
      //     log2
      //   );
      // }

      instructionPointer += 2;
      continue;
    }

    /// 6-bdv
    if (opcode === 6) {
      const numerator = a;
      const denominator = 2 ** readCombo(operand);
      b = Math.floor(numerator / denominator);
      instructionPointer += 2;
      continue;
    }

    /// 7-bdv
    if (opcode === 7) {
      const numerator = a;
      const denominator = 2 ** readCombo(operand);
      c = Math.floor(numerator / denominator);
      instructionPointer += 2;
      continue;
    }

    throw new Error(`Invalid opcode: ${opcode}`);
  }
  return output;

  function readCombo(value) {
    if (value === 0 || value === 1 || value === 2 || value === 3) return value;
    if (value === 4) return a;
    if (value === 5) return b;
    if (value === 6) return c;

    throw new Error("invalid combo value");
  }
}

// compute(0, 0, 9, [2, 6]);

// i've gotten almost there finding up to 14/16 digits
// startA 2015520102033967 24117503144055 old 2015451382557231 diff 68719476736 log2 36

// got one! it's too high!
// (202356708354607)[(2, 4, 1, 1, 7, 5, 0, 3, 1, 4, 4, 0, 5, 5, 3, 0)];

// ) {

const result = compute(202356708354607, parsed.b, parsed.c, parsed.program);
console.log("result", result);

const start = 202356708354606;
// const stepSize = +(2 ** 20);
const stepSize = -1;

let testA = start;
while (true) {
  const output = compute(testA, parsed.b, parsed.c, parsed.program);
  if (output.length >= 14) {
    console.log(testA, output.length);
  }
  // if (output === false) continue;
  testA += stepSize;
  if (output.length !== parsed.program.length) continue;
  console.log(testA, output);
  // break;
}

const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
