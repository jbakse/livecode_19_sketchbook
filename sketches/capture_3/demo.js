// module

import { Grabber } from "./grabber.js";
import "https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js";

const preset = "webm";
const grabber = new Grabber(1920, 1080, 30, preset);

window.setup = function () {
  pixelDensity(2);
  createCanvas(1920, 1080);
  background(50);

  console.log(canvas);
  // download after 10 seconds
  setTimeout(() => {
    grabber.download(`${getBrowserName()}_${preset}`);
  }, 10000);
};

window.draw = function () {
  noStroke();
  fill(255, 10);
  background(0, 10);
  for (let i = 0; i < 10000; i++) {
    const x = map(frameCount % 90, 1, 90, 0, width);
    const y = height / 2;
    ellipse(
      x + random(-100, 100) + random(-100, 100),
      y + random(-100, 100) + random(-100, 100),
      20,
      20
    );
  }

  grabber.grabFrame(canvas);
};

// window.mousePressed = function () {
//   grabber.download(`${getBrowserName()}_${preset}`);
// };

function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  ) {
    return "Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  } else if (userAgent.includes("Edg")) {
    return "Edge";
  } else if (userAgent.includes("OPR")) {
    return "Opera";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    return "Internet Explorer";
  } else {
    return "Unknown Browser";
  }
}
