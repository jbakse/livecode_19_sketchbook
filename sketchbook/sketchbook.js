/* global Handlebars js2md*/
console.log("%c Sketchbook ", "color: yellow; background: #000;");

import Tree from "./js/tree.js";
import Path from "./js/path.js";
import Nav from "./js/nav.js";
import builders from "./js/template_builders.js";

import settings from "./settings.js";
const urlParams = new URLSearchParams(window.location.search);

let tree;
async function main() {
  tree = await Tree.load("sketches_tree.json", settings.sketchPath);

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

window.ls = () => {
  console.log("ls");
  let ls = "";

  console.log(tree);

  tree.children.forEach((folder) => {
    if (folder.type === "file") return;
    ls += `<ul>`;
    ls += `<h2>${folder.name}</h2>`;
    folder.children.forEach((file) => {
      if (file.type === "folder") return;
      ls += `<li><a href="?sketch=${folder.name}/${file.name}&amp;source">${file.name}</a></li>`;
    });
    ls += `</ul>`;
  });
  return ls;
};

main();
