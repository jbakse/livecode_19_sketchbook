/* global Handlebars js2md*/
console.log("%c Sketchbook ", "color: yellow; background: #000;");

import Tree from "./js/tree.js";
import Path from "./js/path.js";
import Nav from "./js/nav.js";
import settings from "./settings.js";
const urlParams = new URLSearchParams(window.location.search);

console.log(settings);
main();

async function main() {
  const tree = await Tree.load("sketches_tree.json", settings.sketchPath);

  const sourcePath = Tree.defaultFile(tree, urlParams.get("sketch") || "");

  console.log("filename", Path.name(sourcePath));
  console.log("root", Path.root(sourcePath));
  console.log("lastExtension", Path.lastExtension(sourcePath));
  console.log("extensions", Path.extensions(sourcePath));

  await Nav.buildNav(tree, sourcePath);

  if (Path.lastExtension(sourcePath) === "js") showJS(sourcePath);
  if (Path.lastExtension(sourcePath) === "txt") showTXT(sourcePath);
  if (Path.lastExtension(sourcePath) === "md") showMD(sourcePath);

  // source view ui
  document.getElementById("toggle-source").onclick = () => {
    document.getElementById("source-frame").classList.toggle("hidden");
  };
  if (urlParams.has("source")) {
    document.getElementById("source-frame").classList.remove("hidden");
  }
}

async function showJS(sourcePath) {
  const rawSource = await getText("../sketches/" + sourcePath);

  // directives
  const directives = readDirectives(rawSource);

  // format source
  /* globals hljs */
  var formattedSource = hljs.highlight("js", rawSource, true).value;
  formattedSource = `<pre class="source">${formattedSource}</pre>`;

  // render source
  // empty

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    libraries: directives.requires,
    fileInfo: Path.info("../sketches/" + sourcePath),
  };

  // build pages from templates
  const sourceSrcDoc = await buildTemplate(
    "plugins/source/source.handlebars",
    context
  );
  const sketchSrcDoc = await buildTemplate("plugins/js/js.handlebars", context);

  // inject pages
  document.getElementById("source-frame").srcdoc = sourceSrcDoc;
  document.getElementById("sketch-frame").srcdoc = sketchSrcDoc;
}

// async function showMDJS() {
// var markdownSource = js2md(rawSource);
// const md = new markdownit();
// const formattedSource = `<div class="md">${md.render(markdownSource)}</div>`;
// }

async function showMD(sourcePath) {
  let rawSource = await getText("../sketches/" + sourcePath);

  // format source
  const formattedSource = `<pre class="source">${rawSource}</pre>`;

  // render source
  /* global markdownit */
  const md = new markdownit();
  const html = md.render(rawSource);

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    html,
    fileInfo: Path.info("../sketches/" + sourcePath),
  };

  // build pages from templates
  const sourceSrcDoc = await buildTemplate(
    "plugins/source/source.handlebars",
    context
  );
  const sketchSrcDoc = await buildTemplate("plugins/md/md.handlebars", context);

  // inject pages
  document.getElementById("sketch-frame").srcdoc = sketchSrcDoc;
  document.getElementById("source-frame").srcdoc = sourceSrcDoc;
}

async function showTXT(sourcePath) {
  let rawSource = await getText("../sketches/" + sourcePath);

  // format source
  const formattedSource = `<pre class="source">${rawSource}</pre>`;

  // render source
  const html = `<pre class="txt">${rawSource}</pre>`;

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    html,
    fileInfo: Path.info("../sketches/" + sourcePath),
  };

  // build pages from templates
  const sourceSrcDoc = await buildTemplate(
    "plugins/source/source.handlebars",
    context
  );
  const sketchSrcDoc = await buildTemplate(
    "plugins/txt/txt.handlebars",
    context
  );

  // inject pages
  document.getElementById("source-frame").srcdoc = sourceSrcDoc;
  document.getElementById("sketch-frame").srcdoc = sketchSrcDoc;
}

async function getText(path) {
  const response = await fetch(path);
  const text = await response.text();
  return text;
}

async function buildTemplate(templatePath, context) {
  const templateText = await getText(templatePath);
  const template = Handlebars.compile(templateText);
  const page = template(context);
  return page;
}

function readDirectives(text) {
  const requireRegex = /^\/\/ ?require (.*?)$/gm;
  const requires = [];
  let match_info;
  while ((match_info = requireRegex.exec(text))) {
    requires.push(match_info[1]);
  }
  return { requires };
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
