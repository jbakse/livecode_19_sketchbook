const name = "Talia Cotton";
const timeDiff = -8;
const l = map(timeDiff, -12, 12, 20, 80);
const d = document.querySelector("div");

let colorStr = "linear-gradient(to right";

for (let i = 0; i < name.length; i++) {
  let val = name.toLowerCase().charCodeAt(i) - 97 + 1;
  let h = map(val, 1, 26, 190, 430);

  val > 0 ? (colorStr += `, hsl(${h},80%,${l}%)`) : (colorStr += ", white");

  if (i == name.length - 1) {
    colorStr += ")";
  }
}

d.style.backgroundImage = colorStr;
d.innerHTML = `"${name}"<br>${timeDiff} hours ahead`;

function getHue(val) {
  return val > 0
    ? (colorStr += `, hsl(${h},80%,${l}%)`)
    : (colorStr += ", white");
}

function map(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}
