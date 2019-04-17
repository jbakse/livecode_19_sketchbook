/* global Handlebars js2md*/
console.log("%c Sketchbook ", "color: yellow; background: #000;");

import Tree from "./js/tree.js";
import Path from "./js/path.js";
import Nav from "./js/nav.js";
import builders from "./js/template_builders.js";

import settings from "./settings.js";
const urlParams = new URLSearchParams(window.location.search);

main();

async function main() {
  const tree = await Tree.load("sketches_tree.json", settings.sketchPath);

  const sketchPath = Tree.defaultFile(tree, urlParams.get("sketch") || "");
  await Nav.buildNav(tree, sketchPath);

  // source view ui
  document.getElementById("toggle-source").onclick = () => {
    document.getElementById("source-frame").classList.toggle("hidden");
  };
  if (urlParams.has("source")) {
    document.getElementById("source-frame").classList.remove("hidden");
  }

  const sourcePath = settings.sketchBase + sketchPath;

  // if (Path.lastExtension(sourcePath) === "js") builders["js"](sourcePath);
  // if (Path.lastExtension(sourcePath) === "txt") builders["txt"](sourcePath);
  // if (Path.lastExtension(sourcePath) === "md") builders["md"](sourcePath);

  const extensions = Path.extensions(sourcePath);
  if (builders.hasOwnProperty(extensions)) {
    builders[extensions](sourcePath);
  } else {
    builders["direct"](sourcePath);
  }
}

// unused

// function last(a) {
//   return a[a.length - 1];
// }

// function getFileName(url) {
//   const fileNameRegex = /[^/]+?(?=\?|$)/;
//   const fileName = fileNameRegex.exec(url)[0];
//   return fileName;
// }
