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

const input = await Deno.readTextFile(import.meta.dirname + "/data_test.txt");
console.log("Input");
console.log(input);

const startTime = performance.now();
const endTime = performance.now();
console.log(`time: ${(endTime - startTime).toFixed(2)}ms`);
