import Path from "./path.js";
/*globals Handlebars*/

export default {
  js: showJS,
  md: showMD,
  txt: showTXT,
};

// context_format = {
//   rawSource: "the text of the source file as loaded",
//   formattedSource: "the text of the source file formatted as HTML (mostly highlighting)",
//   libraries: "list of paths to javascript libraries that should be included",
//   -not implemented- html: "html snippet that should be injected into body",
//   content: "the formatted content for the sketch frame"
//   fileInfo: {
//     path: "full path to the sketch file",
//     name: "the name.ext of the sketch file",
//     root: "the name (without extension) of the sketch file",
//     lastExtension: "example.md.js -> js",
//     extensions: "example.md.js -> md.js",
//   },
// };

async function showJS(sourcePath) {
  const rawSource = await getText(sourcePath);
  let html;
  // paperscript

  const paperscriptRegex = /^\/\/ ?paperscript$/gm;
  const attributes = [];
  if (paperscriptRegex.test(rawSource)) {
    html = '<canvas id="paper-canvas"></canvas>';
    attributes.push('type="text/paperscript"');
    attributes.push('canvas="paper-canvas"');
  }

  // directives
  const directives = readDirectives(rawSource);

  // format source
  /* globals hljs */
  var formattedSource = hljs.highlight("js", rawSource, true).value;

  // render source
  // empty

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    libraries: directives.requires,
    attributes,
    html,
    fileInfo: Path.info(sourcePath),
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
  let rawSource = await getText(sourcePath);

  // format source
  const formattedSource = false;

  // render source
  /* global markdownit */
  const md = new markdownit();
  const content = md.render(rawSource);

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    content,
    fileInfo: Path.info(sourcePath),
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
  let rawSource = await getText(sourcePath);

  // format source
  const formattedSource = rawSource;

  // render source
  const content = rawSource;

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    content,
    fileInfo: Path.info(sourcePath),
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
