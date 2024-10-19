// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";
import { FPS } from "./FPS.js";
import { Enemy, FastEnemy } from "./enemy.js";
import { Player } from "./player.js";

export const actors = [];
export let player;

export const controls = new Controls();
controls.bind("ArrowLeft", "left");
controls.bind("a", "left");
controls.bind("ArrowRight", "right");
controls.bind("d", "right");
controls.bind(" ", "fire");

export const graphics = new Graphics(1024, 1024);
export const images = {};
export const fps = new FPS();
fps.show();

/// game lifecycle

await preload();
setup();

function onFrame(t) {
  step();
  draw();
  window.requestAnimationFrame(onFrame);
}

onFrame();

/// game lifecycle

async function preload() {
  images.ghost = await graphics.loadImage(
    sketch_directory + "images/ghost.png"
  );
}

function setup() {
  player = new Player();
  actors.push(player);
  for (let i = 0; i < 10; i++) {
    actors.push(new Enemy(Math.random() * 1024, Math.random() * 512));
  }

  for (let i = 0; i < 2; i++) {
    actors.push(new FastEnemy(Math.random() * 1024, Math.random() * 512));
  }
}

function step() {
  for (const actor of actors) {
    actor.step();
  }

  filterInPlace(actors, (actor) => !actor.shouldBeRemoved);
}

function draw() {
  graphics.background("black");

  for (const actor of actors) {
    actor.draw();
  }

  fps.step();
  controls.tick();
}

/// utility functions
function range(start, end, step) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (step === undefined) {
    step = 1;
  }
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

function filterInPlace(a, condition) {
  let i = 0;
  let j = 0;
  while (i < a.length) {
    if (condition(a[i])) {
      a[j] = a[i];
      j++;
    }
    i++;
  }
  a.length = j;
}

function example() {}

const o = {
  example: example;
}

example();

o.example();