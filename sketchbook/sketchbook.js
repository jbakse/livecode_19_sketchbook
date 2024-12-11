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
    const hidden = document
      .getElementById("source-frame")
      .classList.toggle("hidden");
    window.localStorage.setItem("hide_source", hidden.toString());
  };

  const hide_source = window.localStorage.getItem("hide_source");

  if (hide_source === null) {
    document.getElementById("source-frame").classList.remove("hidden");
    if (urlParams.has("view")) {
      document.getElementById("source-frame").classList.add("hidden");
    }
    if (urlParams.has("source")) {
      document.getElementById("source-frame").classList.remove("hidden");
    }
  } else if (hide_source === "true") {
    document.getElementById("source-frame").classList.add("hidden");
  } else {
    document.getElementById("source-frame").classList.remove("hidden");
    console.log(document.getElementById("source-frame").classList);
  }

  const sourcePath = settings.sketchBase + sketchPath;

  // if (Path.lastExtension(sourcePath) === "js") builders["js"](sourcePath);
  // if (Path.lastExtension(sourcePath) === "txt") builders["txt"](sourcePath);
  // if (Path.lastExtension(sourcePath) === "md") builders["md"](sourcePath);

  const extensions = Path.extensions(sourcePath);
  if (builders.hasOwnProperty(extensions)) {
    builders[extensions](sourcePath);
  } else {
    builders.direct(sourcePath);
  }
}

window.ls = (path = "", maxDepth = 3, currentDepth = 1) => {
  if (currentDepth > maxDepth) return "";
  let markup = "<ul>";
  // console.log("t", tree);
  const branch = Tree.getItem(tree, path);

  branch.children.sort((a, b) => {
    if (a.type === "file" && b.type === "folder") return -1;
    if (a.type === "folder" && b.type === "file") return 1;
    return 0;
  });

  branch.children.forEach((item) => {
    if (item.type === "file") {
      const indexClass = item.name.startsWith("index") ? "index" : "";
      const sourceParam = "";
      markup += `<li class="file ${indexClass}"><a class="file" href="?sketch=${path}/${item.name}&amp;${sourceParam}">${item.name}</a></li>`;
    }
    if (item.type === "folder") {
      const sourceParam = "";
      markup += '<li class="folder">';
      markup += `<h${currentDepth + 1}>`;
      markup += `<a class="folder" href="?sketch=${path}/${item.name}&amp;${sourceParam}">${item.name}</a>`;
      markup += "</h1>";
      markup += window.ls(`${path}/${item.name}`, maxDepth, currentDepth + 1);
      markup += "</li>";
    }
  });

  markup += "</ul>";
  return markup;
};

window.initSearch = (input, ls) => {
  console.log(input, ls);
  input.focus();
  input.onkeyup = () => updateSearch(input, ls);
};

function updateSearch(input, ls) {
  console.log("update search", input.value);
  const start = performance.now();
  const lis = ls.querySelectorAll("li.folder, li.file");
  console.log(`searching ${lis.length} files`);
  for (const li of lis) {
    li.classList.remove("hidden");
  }
  for (const li of lis) {
    if (!li.innerText.toLowerCase().includes(input.value.toLowerCase())) {
      li.classList.add("hidden");
    }
  }
  const end = performance.now();
  console.log(`search took ${end - start} ms`);
}

main();

// ls += `<ul>`;
// ls += `<h2>${item.name}</h2>`;
// item.children.forEach((file) => {
//   if (file.type === "folder") return;
//   ls += `<li><a href="?sketch=${item.name}/${file.name}&amp;source">${file.name}</a></li>`;
// });
// ls += `</ul>`;
