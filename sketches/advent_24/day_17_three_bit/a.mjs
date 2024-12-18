/* eslint-disable operator-assignment */
/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable radix */
/* globals Deno */
/* eslint-disable no-labels */
/* eslint-disable prefer-template */

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

import { banner, info, log, warn, error } from "../library/logger.ts";

banner("Advent of Code: Day 17a");

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

function compute(a, b, c, program) {
  let instructionPointer = 0;
  const output = [];

  let step = 0;
  while (++step < 1_000) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];
    console.log(
      `step ${step}: [${a} ${b} ${c}] ${colors.red(
        instructionPointer + ""
      )} -> ${opcode}(${operand})`
    );

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
      b = b ^ operand; // xor
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
      b = b ^ c;
      instructionPointer += 2;
      continue;
    }

    /// 5-out
    if (opcode === 5) {
      const value = readCombo(operand) % 8;
      console.log("output", value);
      output.push(value);
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

const output = compute(parsed.a, parsed.b, parsed.c, parsed.program);

console.log("output", output.join(","));
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
