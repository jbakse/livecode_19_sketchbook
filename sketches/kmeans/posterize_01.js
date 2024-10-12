// module
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// docs at https://github.com/mljs/kmeans
import { kmeans } from "https://cdn.skypack.dev/ml-kmeans";

// docs at https://tweakpane.github.io/docs
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js";

const params = {
  k: 3,
};
const pane = new Pane();
pane.addBinding(params, "k", {
  label: "k",
  options: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    16: 16,
    32: 32,
  },
});

pane.on("change", () => {
  process();
  redraw();
});

const images = {};

window.preload = function () {
  images.source = loadImage(sketch_directory + "tents_256.webp");
};

window.setup = function () {
  createCanvas(512, 1024);
  background(255);
  noLoop();

  images.source.loadPixels();

  images.processed = createImage(images.source.width, images.source.height);

  process();
};

window.draw = function () {
  image(images.source, 0, 0, 512, 512);
  image(images.processed, 0, 512, 512, 512);
};

function process() {
  /// turn images.source.pixels into a 2D array of RGB values
  const data = [];

  for (let i = 0; i < images.source.pixels.length; i += 4) {
    data.push([
      images.source.pixels[i],
      images.source.pixels[i + 1],
      images.source.pixels[i + 2],
    ]);
  }

  /// group in to k clusters
  const result = kmeans(data, params.k, {
    seed: 0,
  });

  console.log(result);

  /// make processed version

  images.processed.loadPixels();
  for (let i = 0; i < images.source.pixels.length; i += 4) {
    const assignment = result.clusters[i / 4];
    const centroid = result.centroids[assignment];
    images.processed.pixels[i] = centroid[0];
    images.processed.pixels[i + 1] = centroid[1];
    images.processed.pixels[i + 2] = centroid[2];
    images.processed.pixels[i + 3] = 255;
  }
  images.processed.updatePixels();
}
