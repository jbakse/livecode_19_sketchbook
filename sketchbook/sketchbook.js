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

  console.log(`%c ${sketchPath} `, "color: yellow; background: #000;");

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

window.ls = (path = "", maxDepth = 6, currentDepth = 1) => {
  if (currentDepth > maxDepth) return;
  let markup = "<ul>";
  // console.log("t", tree);
  const branch = Tree.getItem(tree, path);

  branch.children.forEach((item) => {
    if (item.type === "file") {
      markup += `<li><a href="?sketch=${path}/${item.name}&amp;source">${item.name}</a></li>`;
    }
    if (item.type === "folder") {
      markup += "<li>";
      markup += `<h${currentDepth + 1}>${item.name}</h1>`;
      markup += window.ls(path + "/" + item.name, maxDepth, currentDepth + 1);
      markup += "</li>";
    }
  });

  markup += "</ul>";
  return markup;
};

main();

// ls += `<ul>`;
// ls += `<h2>${item.name}</h2>`;
// item.children.forEach((file) => {
//   if (file.type === "folder") return;
//   ls += `<li><a href="?sketch=${item.name}/${file.name}&amp;source">${file.name}</a></li>`;
// });
// ls += `</ul>`;
