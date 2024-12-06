// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const nodes = [];

function setup() {
  createCanvas(720, 480);

  const nodeCount = 1;

  for (let i = 0; i < nodeCount; i++) {
    spawn(360 + random(-100, 100), 240 + random(-100, 100));
  }
}

function spawn(x, y, dX = random(-1, 1), dY = random(-1, 1)) {
  const newNode = {
    x,
    y,
    dX: 0,
    dY: 0,
    radius: 1,
    parent: null,
    length: 0,
    growRate: random(1, 1.1),
  };
  nodes.push(newNode);

  const childNode = {
    x: newNode.x + dX,
    y: newNode.y + dY,
    dX: 0,
    dY: 0,
    radius: 1,
    parent: newNode,
    length: 1,
    growRate: random(1, 1.1),
  };
  nodes.push(childNode);
}

function draw() {
  step();

  background("black");

  noFill();
  stroke("white");

  for (const node of nodes) {
    if (!node.parent) continue;
    strokeWeight(node.radius * 2);
    line(node.x, node.y, node.parent.x, node.parent.y);
  }

  fill("red");
  noStroke();

  for (const node of nodes) {
    ellipse(node.x, node.y, 2, 2);
  }
}

function step() {
  /// mouse force
  // for (const node of nodes) {
  //   if (!node.parent) continue;
  //   const currentDistance = dist(node.x, node.y, mouseX, mouseY);
  //   const minDistance = 50;
  //   if (currentDistance < minDistance) {
  //     const angle = atan2(node.y - mouseY, node.x - mouseX);
  //     const dx = cos(angle) * (minDistance - currentDistance);
  //     const dy = sin(angle) * (minDistance - currentDistance);
  //     node.dX += dx * 0.1;
  //     node.dY += dy * 0.1;
  //   }
  // }

  /// relax
  for (const a of nodes) {
    for (const b of nodes) {
      if (a === b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = dist(a.x, a.y, b.x, b.y);
      const minD = a.radius + b.radius + 4;
      if (d < minD) {
        const angle = atan2(dy, dx);
        const diff = minD - d;
        a.x -= cos(angle) * diff * 0.05;
        a.y -= sin(angle) * diff * 0.05;
        b.x += cos(angle) * diff * 0.05;
        b.y += sin(angle) * diff * 0.05;
      }
    }
  }

  /// spring force
  for (const node of nodes) {
    if (!node.parent) continue;

    const currentLength = dist(node.x, node.y, node.parent.x, node.parent.y);
    const stretch = currentLength - node.length;
    const angle = atan2(node.y - node.parent.y, node.x - node.parent.x);
    const dx = cos(angle) * stretch * 0.5;
    const dy = sin(angle) * stretch * 0.5;
    node.dX -= dx * 0.03;
    node.dY -= dy * 0.03;
    // if (!node.parent.parent) continue;
    node.parent.dX += dx * 0.03;
    node.parent.dY += dy * 0.03;

    //@note unballancing the forces on each end of the spring creates
    //an interesting move effect
  }

  /// gravity
  //   for (const node of nodes) {
  //     if (!node.parent) continue;
  //     node.dY += 0.005;
  //   }

  /// center gravity
  const center = { x: 360, y: 240 };
  for (const node of nodes) {
    const g = normalize({ x: center.x - node.x, y: center.y - node.y });
    node.dX += g.x * 0.01;
    node.dY += g.y * 0.01;
  }

  /// dampen
  for (const node of nodes) {
    // if (!node.parent) continue;
    node.dX *= 0.9;
    node.dY *= 0.9;
  }

  /// momentum
  for (const node of nodes) {
    // if (!node.parent) continue;
    node.x += node.dX;
    node.y += node.dY;
  }

  /// grow
  for (const node of nodes) {
    if (node.radius < 6) node.radius += 0.02;
    if (node.parent) {
      if (node.length < 8) node.length += 0.1 * node.growRate;
    }
  }

  /// split
  const existingNodes = [...nodes];
  for (const node of existingNodes) {
    if (!node.parent) continue;
    if (node.length < 8) continue;
    if (nodes.length > 512) continue;
    console.log("split");

    const aN = 0.2;

    const a = {
      x: lerp(node.parent.x, node.x, aN),
      y: lerp(node.parent.y, node.y, aN),
      dX: lerp(node.parent.dX, node.dX, aN),
      dY: lerp(node.parent.dY, node.dY, aN),
      radius: lerp(node.parent.radius, node.radius, aN),
      parent: node.parent,
      length: node.length * aN,
      growRate: random(1, 1.1),
    };
    nodes.push(a);

    const bN = 0.8;
    const b = {
      x: lerp(node.parent.x, node.x, bN),
      y: lerp(node.parent.y, node.y, bN),
      dX: lerp(node.parent.dX, node.dX, bN),
      dY: lerp(node.parent.dY, node.dY, bN),
      radius: lerp(node.parent.radius, node.radius, bN),
      parent: node,
      length: node.length * 0.4,
      growRate: random(1, 1.1),
    };
    nodes.push(b);

    node.parent = null;
  }

  //   console.log(
  //     nodes[0].radius.toFixed(2),
  //     nodes[1].radius.toFixed(2),
  //     nodes[1].length.toFixed(2)
  //   );

  //   if (frameCount % 100 === 0) {
  //     const l = nodes.length;
  //     for (let i = 0; i < l; i++) {
  //       const node = nodes[i];
  //       if (!node.parent) continue;
  //       const direction = normalize({
  //         x: node.x - node.parent.x,
  //         y: node.y - node.parent.y,
  //       });
  //       spawn(
  //         node.x + direction.x * 10,
  //         node.y + direction.y * 10,
  //         direction.x,
  //         direction.y
  //       );
  //     }
  //   }
}

function normalize(v) {
  const d = dist(0, 0, v.x, v.y);
  return { x: v.x / d, y: v.y / d };
}

/**
 * todo: .
 * Look at if growing the "radius" is a good idea at all.
 * Increase the the power of the relax so that interior nodes fully separate.
 * Probably need to look into more steps per frame, and maybe improved integration.
 * At least half v method? Improved Euler?
 * Add some artifical force to align the baceteria on a common axis.
 * The repel radius and the drawing radius can be separate.
 *
 * The spawning could be improved (DRY)
 * Some of the params in spawn are leftover, clean up.
 *
 * spacial partitioning
 *
 * Some visual effects, bloom, vignette, grain, would be nice here.
 *
 */
