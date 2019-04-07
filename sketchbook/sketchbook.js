/* global Handlebars */
console.log("Sketchbook");

const context = {
  path: "",
  fileName: "",
  fileTitle: "",
  fileExtensions: [],
  libraries: [],
};

async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const sketchPath = "/sketches/" + urlParams.get("sketch");

  context.path = sketchPath;
  context.fileName = getFileName(sketchPath);
  context.fileTitle = context.fileName.split(".")[0];
  context.fileExtensions = context.fileName.split(".").splice(1);

  const sketch = await getText(sketchPath);
  const directives = readDirectives(sketch);
  context.libraries = directives.libraries;

  const page = await buildPage(context);
  console.log(page);
  document.getElementById("sketch-frame").srcdoc = page;
}
main();

function last(a) {
  return a[a.length - 1];
}
function getFileName(url) {
  const fileNameRegex = /[^/]+?(?=\?|$)/;
  const fileName = fileNameRegex.exec(url)[0];
  return fileName;
}

async function getText(path) {
  const response = await fetch(path);
  const text = await response.text();
  return text;
}

function readDirectives(text) {
  const requireRegex = /^\/\/ ?require (.*?)$/gm;
  const libraries = [];
  let match_info;
  while ((match_info = requireRegex.exec(text))) {
    libraries.push(match_info[1]);
  }

  return { libraries };
}

async function buildPage(context) {
  const templateResponse = await fetch("layout.handlebars");
  const templateText = await templateResponse.text();
  const template = Handlebars.compile(templateText);
  const page = template(context);
  return page;
}
