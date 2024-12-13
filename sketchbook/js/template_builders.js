import * as path from "./path.js";
/*globals Handlebars*/

export default {
  "js": showJS,
  "md": showMD,
  "md.js": showMDJS,
  "txt": showTXT,
  "frag": showTXT,
  "html": showHTML,
  "direct": showDirect,
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
async function getText(textPath) {
  try {
    const response = await fetch(textPath);
    if (!response.ok) {
      throw new Error(`Network response was not "ok": ${response.statusText}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`Failed to fetch text from ${textPath}`);
    throw error;
  }
}

async function showTXT(sourcePath) {
  const rawSource = await getText(sourcePath);

  // build pages from templates
  const sourceDoc = await buildTemplate("plugins/source/source.handlebars", {
    formattedSource: rawSource,
    fileInfo: path.info(sourcePath),
  });
  const sketchDoc = await buildTemplate("plugins/txt/txt.handlebars", {
    content: rawSource,
    fileInfo: path.info(sourcePath),
  });

  // inject pages
  document.getElementById("source-frame").srcdoc = sourceDoc;
  document.getElementById("sketch-frame").srcdoc = sketchDoc;
}

async function showMD(sourcePath) {
  const rawSource = await getText(sourcePath);

  // render content
  /* global markdownit */
  // eslint-disable-next-line new-cap
  const md = new markdownit({ html: true });
  const content = md.render(rawSource);

  // build pages from templates
  const sourceDoc = await buildTemplate("plugins/source/source.handlebars", {
    rawSource,
    fileInfo: path.info(sourcePath),
  });
  const sketchDoc = await buildTemplate("plugins/md/md.handlebars", {
    content,
    fileInfo: path.info(sourcePath),
  });

  // inject pages
  document.getElementById("sketch-frame").srcdoc = sketchDoc;
  document.getElementById("source-frame").srcdoc = sourceDoc;
}

async function showJS(sourcePath) {
  const rawSource = await getText(sourcePath);
  let html;
  // paperscript

  const paperscriptRegex = /^\/\/ ?paperscript ?(\d*)? ?(\d*)?$/gm;
  const attributes = [];
  let r = paperscriptRegex.exec(rawSource);
  if (r) {
    // console.log(paperscriptRegex.test(rawSource));

    // console.log("result", r);
    const w = r[1] || 512;
    const h = r[2] || 512;
    html = `<canvas id="paper-canvas" width="${w}" height="${h}"></canvas>`;
    attributes.push('type="text/paperscript"');
    attributes.push('canvas="paper-canvas"');
  }

  // look for // module comment
  const moduleRegex = /^\/\/ ?module/gm;
  const isModule = moduleRegex.test(rawSource);
  if (isModule) {
    attributes.push('type="module"');
  }

  // directives
  const directives = readDirectives(rawSource);

  // format source
  /* globals hljs */
  var formattedSource = hljs.highlight("js", rawSource, true).value;
  // console.log(formattedSource);

  // render source
  // empty

  // prepare template info
  const context = {
    rawSource,
    formattedSource,
    libraries: directives.requires,
    attributes,
    html,
    fileInfo: path.info(sourcePath),
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

async function showMDJS(sourcePath) {
  const rawSource = await getText(sourcePath);
  let html;
  // paperscript

  const paperscriptRegex = /^\/\/ ?paperscript ?(\d*)? ?(\d*)?$/gm;
  const attributes = [];
  let r = paperscriptRegex.exec(rawSource);
  if (r) {
    // console.log(paperscriptRegex.test(rawSource));

    // console.log("result", r);
    const w = r[1] || 512;
    const h = r[2] || 512;
    html = `<canvas id="paper-canvas" width="${w}" height="${h}"></canvas>`;
    attributes.push('type="text/paperscript"');
    attributes.push('canvas="paper-canvas"');
  }

  // directives
  const directives = readDirectives(rawSource);

  // format source
  /* globals js2md */
  // var formattedSource = hljs.highlight("js", rawSource, true).value;
  var markdownSource = js2md(rawSource);
  const md = new markdownit();
  const content = `<div class="md">${md.render(markdownSource)}</div>`;
  // console.log(content);

  // render source
  // empty

  // prepare template info
  const context = {
    rawSource,
    content,
    libraries: directives.requires,
    attributes,
    html,
    fileInfo: path.info(sourcePath),
  };

  // build pages from templates
  const sourceSrcDoc = await buildTemplate("plugins/md/md.handlebars", context);
  const sketchSrcDoc = await buildTemplate("plugins/js/js.handlebars", context);

  // inject pages
  document.getElementById("source-frame").srcdoc = sourceSrcDoc;
  document.getElementById("sketch-frame").srcdoc = sketchSrcDoc;
}

async function showHTML(sourcePath) {
  let rawSource = await getText(sourcePath);

  // format source
  const formattedSource = hljs.highlight("js", rawSource, true).value;

  // render source
  const content = rawSource;

  // prepare template info
  const context = {
    formattedSource,
    content,
    fileInfo: path.info(sourcePath),
  };

  // build pages from templates
  const sourceSrcDoc = await buildTemplate(
    "plugins/source/source.handlebars",
    context
  );

  // inject pages
  document.getElementById("source-frame").srcdoc = sourceSrcDoc;
  document.getElementById("sketch-frame").src = sourcePath;
}

async function showDirect(sourcePath) {
  let rawSource = await getText(sourcePath);

  // format source
  // const formattedSource = rawSource;

  // render source
  const content = rawSource;

  // prepare template info
  const context = {
    rawSource,
    // formattedSource,
    content,
    fileInfo: path.info(sourcePath),
  };

  // build pages from templates
  const sourceSrcDoc = await buildTemplate(
    "plugins/source/source.handlebars",
    context
  );

  // inject pages
  document.getElementById("source-frame").srcdoc = sourceSrcDoc;

  document.getElementById("sketch-frame").src = sourcePath;
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
    const match = match_info[1];
    // if match starts with "module "
    const isModule = match.startsWith("module ");
    const type = isModule ? "module" : "";
    // name with "module " removed, if present
    const name = isModule ? match.slice(7) : match;
    // requires.push(match_info[1]);
    requires.push({ name, isModule, type });
  }

  return { requires };
}
