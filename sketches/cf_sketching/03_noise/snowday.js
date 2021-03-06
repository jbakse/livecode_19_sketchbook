// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// a snow day Feb 2017

function setup() {
  // create a place to draw
  createCanvas(640, 320);
  noStroke();
  colorMode(HSB, 100);
  ellipseMode(CENTER);
}

function draw() {
  var i;
  var snowmenCount = random(1, 3);

  // clear the background
  background(60, 30, 100);

  // draw a snow drift
  blanket(45);
  for (i = 0; i < snowmenCount; i++) {
    snowman(random(width), height - 120 - random(10), random(0.5, 0.8));
  }

  // dim it back with a transparent overlay
  fill(60, 30, 100, 30);
  rect(0, 0, width, height);

  // draw a second drift + snowmen
  blanket(35);
  for (i = 0; i < snowmenCount; i++) {
    snowman(random(width), height - 100 - random(10), random(0.8, 1.2));
  }

  // dim it back with a transparent overlay
  fill(60, 30, 100, 30);
  rect(0, 0, width, height);

  // draw a third drift + snowmen
  blanket(25);
  for (i = 0; i < snowmenCount; i++) {
    snowman(random(width), height - 70 - random(10), random(1.2, 2.0));
  }

  // draw snowflakes
  for (i = 0; i < 4000; i++) {
    var x = random(width);
    var y = random(height);
    var size = min(random(10), random(10), random(10));
    snowflake(x, y, size);
  }

  // draw static
  // this makes a sort of staticy vignette effect
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      blendMode(ADD);
      // find the distance from center
      var alpha = dist(width * 0.5, height * 0.5, x, y);
      // remap distance to a tone down effect
      alpha = map(alpha, 0, width * 0.5, 0, 15);
      fill(60, random(100), 100, alpha);
      rect(x, y, 1, 1);
    }
  }

  noLoop();
}
function blanket(depth) {
  var y = height - depth;
  for (var x = 0; x < width; x += 16) {
    push();
    fill(60, 10, 100, 5);
    y += random(-2, 2); // offset the height of snow with something like brownian motion
    blendMode(ADD);
    ellipse(x, y, depth * 3, depth * 3);
    pop();
  }
}

function snowman(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  blendMode(BLEND);
  var offset = 1;

  // draw some darker circles in back to create some contrast, pull out edges
  fill(60, 40, 100, 60);
  // blob shadow
  ellipse(0 + random(-4, 4), 23, 45 + random(-4, 4), 5 + random(-4, 4));
  ellipse(0 + random(-4, 4), 23, 45 + random(-4, 4), 5 + random(-4, 4));

  // bottom
  ellipse(
    0 + offset + random(-2, 2),
    0 + offset + random(-2, 2),
    45 + random(-2, 2),
    45 + random(-2, 2)
  );
  ellipse(
    0 + offset + random(-2, 2),
    0 + offset + random(-2, 2),
    45 + random(-2, 2),
    45 + random(-2, 2)
  );
  // middle
  ellipse(
    0 + offset + random(-2, 2),
    -25 + offset + random(-2, 2),
    35 + random(-2, 2),
    35 + random(-2, 2)
  );
  ellipse(
    0 + offset + random(-2, 2),
    -25 + offset + random(-2, 2),
    35 + random(-2, 2),
    35 + random(-2, 2)
  );
  // top
  ellipse(
    0 + offset + random(-1, 1),
    -45 + offset + random(-1, 1),
    23 + random(-1, 1),
    23 + random(-1, 1)
  );

  //draw bottom (use a few randomly mutated ellipses to make it look more natural)
  fill(60, 0, 100, 60);
  ellipse(
    0 + random(-3, 3),
    0 + random(-3, 3),
    40 + random(-3, 3),
    40 + random(-3, 3)
  );
  ellipse(
    0 + random(-3, 3),
    0 + random(-3, 3),
    40 + random(-3, 3),
    40 + random(-3, 3)
  );
  ellipse(
    0 + random(-3, 3),
    0 + random(-3, 3),
    40 + random(-3, 3),
    40 + random(-3, 3)
  );

  // draw middle
  fill(60, 0, 100, 60);
  ellipse(
    0 + random(-3, 3),
    -25 + random(-3, 3),
    30 + random(-3, 3),
    30 + random(-3, 3)
  );
  ellipse(
    0 + random(-3, 3),
    -25 + random(-3, 3),
    30 + random(-3, 3),
    30 + random(-3, 3)
  );
  ellipse(
    0 + random(-3, 3),
    -25 + random(-3, 3),
    30 + random(-3, 3),
    30 + random(-3, 3)
  );

  // draw top
  fill(60, 0, 100, 60);
  ellipse(
    0 + random(-1, 1),
    -45 + random(-1, 1),
    20 + random(-1, 1),
    20 + random(-1, 1)
  );
  ellipse(
    0 + random(-1, 1),
    -45 + random(-1, 1),
    20 + random(-1, 1),
    20 + random(-1, 1)
  );
  ellipse(
    0 + random(-1, 1),
    -45 + random(-1, 1),
    20 + random(-1, 1),
    20 + random(-1, 1)
  );

  pop();
}

function snowflake(x, y, size) {
  // map size to saturation. bigger flakes are closer, should be more white
  // smaller flakes are further, should be more like the background.
  var alpha = map(size, 0, 10, 0, 15);

  push();

  blendMode(ADD);

  translate(random(width), random(height));
  fill(60, 0, 100, alpha);

  // draw flakes as two jittered ellipses, so they don't look quite so computery.
  ellipse(
    random(-1, 1),
    random(-1, 1),
    size + random(-1, 1),
    size + random(-1, 1)
  );
  ellipse(
    random(-1, 1),
    random(-1, 1),
    size + random(-1, 1),
    size + random(-1, 1)
  );

  pop();
}
