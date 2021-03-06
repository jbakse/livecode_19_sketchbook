function main() {
  let result = tree();

  console.log(result);

  return result;
}
const taper = 0.7;
const shorten = 0.9;

function tree(depth = 4, r = 8, l = 10) {
  console.log(depth, r);

  let result = cylinder({ r1: r, r2: r * taper, h: l });

  if (depth === 0) {
    let leaf = cylinder({ r1: r * taper, r2: 0, h: l * 0.5 });
    leaf = translate([0, 0, l], leaf);
    result = result.union(leaf);
    return result;
  }

  // const branch1 = translate(
  //     [0,10,10],
  //   tree(depth-1, r*taper)
  // );

  if (Math.random() < 0.8) {
    let branch1 = tree(depth - 1, r * taper, l * shorten * rand(0.8, 1.1));
    branch1 = rotate([rand(30, 60), 0, 0], branch1);
    branch1 = rotate([0, 0, 0], branch1);
    branch1 = translate([0, 0, l], branch1);
    result = result.union(branch1);

    let branch2 = tree(depth - 1, r * taper, l * shorten * rand(0.8, 1.1));
    branch2 = rotate([rand(30, 60), 0, 0], branch2);
    branch2 = rotate([0, 0, 120], branch2);
    branch2 = translate([0, 0, l], branch2);
    result = result.union(branch2);

    let branch3 = tree(depth - 1, r * taper, l * shorten * rand(0.8, 1.1));
    branch3 = rotate([rand(30, 60), 0, 0], branch3);
    branch3 = rotate([0, 0, 240], branch3);
    branch3 = translate([0, 0, l], branch3);
    result = result.union(branch3);
  }

  // result.push(branch1);

  return result;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
