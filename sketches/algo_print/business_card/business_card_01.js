// require https://cdn.jsdelivr.net/npm/tweakpane@1.5.8/dist/tweakpane.min.js

// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

/* global Tweakpane */
/* exported setup draw */

{
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

{
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Zen+Antique&display=swap');";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

const PPI = 72;
const CARD_WIDTH = 3.5 * PPI;
const CARD_HEIGHT = 2 * PPI;
const CARD_COLUMNS = 4;
const CARD_ROWS = 6;
const CARD_GUTTER = 0.5 * PPI;

const pane = new Tweakpane();
const params = {};

const texts = [
  "Justin Bakse",
  "Creative Coder",
  "baksej@newschool.edu",
  "justinbakse.com",
  "",
];

function setup() {
  let canvas_width = (CARD_WIDTH + CARD_GUTTER) * CARD_COLUMNS + CARD_GUTTER;
  let canvas_height = (CARD_HEIGHT + CARD_GUTTER) * CARD_ROWS + CARD_GUTTER;

  params.columns = 4;
  pane.addInput(params, "columns", { min: 0, max: 5, step: 1 });

  params.gutter_width = 0.1;
  pane.addInput(params, "gutter_width", { min: 0, max: 1, label: "gutter" });

  params.lineheight = 0.35;
  pane.addInput(params, "lineheight", { min: 0, max: 0.5, label: "l. height" });

  params.text_size = 18;
  pane.addInput(params, "text_size", { min: 6, max: 24, label: "text size" });

  params.font_family = "Zen Kaku Gothic Antique";
  pane.addInput(params, "font_family", {
    label: "font",
    options: {
      zen: "Zen Antique",
      "zen kaku": "Zen Kaku Gothic Antique",
      monospace: "Monospace",
    },
  });

  params.show_grid = false;
  pane.addInput(params, "show_grid", { label: "show grid" });

  pane.on("change", draw);

  createCanvas(canvas_width, canvas_height);

  // noLoop();
}

function draw() {
  background(230);
  randomSeed(1);

  let column_grid = makeColumnGrid(
    CARD_WIDTH,
    params.columns,
    params.gutter_width * PPI
  );

  let r = { l: 0, t: 0, w: CARD_WIDTH, h: CARD_HEIGHT };
  for (let row = 0; row < CARD_ROWS; row++) {
    for (let col = 0; col < CARD_COLUMNS; col++) {
      r.l = CARD_GUTTER + col * (CARD_WIDTH + CARD_GUTTER);
      r.t = CARD_GUTTER + row * (CARD_HEIGHT + CARD_GUTTER);
      let text_items = placeTextItems(texts, column_grid);
      drawCard(r);
      if (params.show_grid) drawColumnGrid(r, column_grid);
      drawTextItems(r, text_items);
    }
  }
}

function makeColumnGrid(w, count, gutter_width) {
  const column_width = (w - gutter_width * (count + 1)) / count;
  const columns = [{ l: gutter_width, w: column_width }];
  for (let c = 1; c < count; c++) {
    columns.push({
      l: gutter_width + (gutter_width + column_width) * c,
      w: column_width,
    });
  }
  return columns;
}

function placeTextItems(texts, column_grid) {
  const items = [];
  const shuffled_texts = shuffle(texts);

  let y = 0;
  for (let t of shuffled_texts) {
    y += params.lineheight;

    push();
    textFont(params.font_family);
    textSize(params.text_size);
    const max_x = CARD_WIDTH - params.gutter_width * PPI - textWidth(t);
    pop();

    const filtered_grid = column_grid.filter((g) => g.l < max_x);
    if (filtered_grid.length === 0) continue;
    items.push({ text: t, x: pick(filtered_grid).l, y: y });
  }

  return items;
}

function rrect(r) {
  rect(r.l, r.t, r.w, r.h);
}

function pick(a) {
  return a[floor(random() * a.length)];
}

function drawCard(r) {
  push();
  fill("white");
  stroke(200);
  rrect(r);
  pop();
}
function drawColumnGrid(r, g) {
  push();
  stroke(200, 200, 255);
  for (let column of g) {
    const left_x = r.l + column.l;
    line(left_x, r.t, left_x, r.t + r.h);

    const right_x = r.l + column.l + column.w;
    line(right_x, r.t, right_x, r.t + r.h);
  }
  pop();
}

function drawTextItems(r, items) {
  push();

  textFont(params.font_family);
  textSize(params.text_size);

  for (let item of items) {
    text(item.text, r.l + item.x, r.t + item.y * PPI);
  }
  pop();
}
