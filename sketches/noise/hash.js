let buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (let n = 0; n < 16; n++) {
  plot(hashit(n));
  buckets[hashit(n)]++;
}

console.log(buckets);

function plot(a) {
  let stars = "";
  for (let i = 0; i < a; i++) {
    stars += "*";
  }
  console.log(stars);
}

// https://www.cs.hmc.edu/~geoff/classes/hmc.cs070.200101/homework10/hashfuncs.html
function hashit(k) {
  let a = (k * (k + 3)) % 16;
  return a;
}

// https://www.cs.hmc.edu/~geoff/classes/hmc.cs070.200101/homework10/hashfuncs.html
function knuthDivisionHash(k) {
  return (k * (k + 3)) % 16;
}
