/* global partyConnect partyLoadShared partyLoadMyShared partyLoadGuestShareds*/
/* global partyIsHost */
/* global partySubscribe */

import { initRock, initRocks, updateRocks } from "./gameStatePlay.js";

export let hostData, me, guests;

export function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "rocks", "main");

  hostData = partyLoadShared("host", { rocks: initRocks() });
  me = partyLoadMyShared({});
  guests = partyLoadGuestShareds({});
}

export function setup() {
  partySubscribe("rockHit", onRockHit);
}

export function update() {
  // bail if we are not the host
  if (!partyIsHost()) return;
  updateRocks();
}

function onRockHit(rockId) {
  // bail if we are not the host
  if (!partyIsHost()) return;

  // find the rock
  const rock = hostData.rocks.find((rock) => rock.id === rockId);
  if (!rock) return;

  // spawn new rocks
  if (rock.size > 16) {
    const newSize = rock.size / 2;
    hostData.rocks.push(
      initRock({
        size: newSize,
        x: rock.x,
        y: rock.y,
        dX: rock.dX + random(-1, 1),
        dY: rock.dY + random(-1, 1),
      })
    );
    hostData.rocks.push(
      initRock({
        size: newSize,
        x: rock.x,
        y: rock.y,
        dX: rock.dX + random(-1, 1),
        dY: rock.dY + random(-1, 1),
      })
    );
  }

  // remove the rock
  // use a slight delay so that other onRockHit handlers have a chance
  // to run before the rock is removed
  setTimeout(() => {
    hostData.rocks = hostData.rocks.filter((rock) => rock.id !== rockId);
  }, 0);
}
