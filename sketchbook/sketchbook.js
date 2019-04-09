/* global Handlebars */
console.log("%c Sketchbook ", "color: yellow; background: #000;");

main();

async function main() {
  const response = await fetch("sketches_tree.json");
  const tree = {
    name: "root",
    type: "folder",
    children: await response.json(),
  };

  const urlParams = new URLSearchParams(window.location.search);
  let path = urlParams.get("sketch") || "";
  path = defaultFile(tree, path);

  await buildNav(tree, path);

  const fileName = getFileName(path);
  const fileExtensions = fileName.split(".").splice(1);

  if (last(fileExtensions) === "js") showJS(path);
  if (last(fileExtensions) === "txt") showTXT(path);
  if (last(fileExtensions) === "md") showMD(path);

  // source view ui
  document.getElementById("toggle-source").onclick = (e) => {
    document.getElementById("source-frame").classList.toggle("hidden");
  };
  if (urlParams.has("source")) {
    document.getElementById("source-frame").classList.remove("hidden");
  }
}

async function showMD(path) {
  const fileName = getFileName(path);
  const sketchPath = "../sketches/" + path;
  let source = await getText(sketchPath);

  /* global markdownit */
  const md = new markdownit();
  const content = md.render(source);

  const page = await buildTemplate("md.handlebars", {
    fileName,
    sketchPath,
    content,
  });

  document.getElementById("sketch-frame").srcdoc = page;

  const source_page = await buildTemplate("txt.handlebars", {
    fileName,
    sketchPath,
    content: source,
  });
  document.getElementById("source-frame").srcdoc = source_page;
}

async function showTXT(path) {
  const fileName = getFileName(path);
  const sketchPath = "../sketches/" + path;
  const content = await getText(sketchPath);

  const page = await buildTemplate("txt.handlebars", {
    fileName,
    sketchPath,
    content,
  });

  document.getElementById("source-frame").srcdoc = page;
  document.getElementById("sketch-frame").srcdoc = page;
}

async function showJS(path) {
  const fileName = getFileName(path);
  const fileExtensions = fileName.split(".").splice(1);
  const sketchPath = "../sketches/" + path;
  const sketch = await getText(sketchPath);
  const directives = readDirectives(sketch);

  const context = {
    sketchPath,
    fileName,
    fileExtensions,
    fileTitle: getFileName(path).split(".")[0],
    libraries: directives.requires,
  };

  const page = await buildTemplate("js.handlebars", context);

  document.getElementById("sketch-frame").srcdoc = page;

  /* globals hljs */
  var hilightedSource = hljs.highlight("js", sketch, true).value;
  // hilightedSource = hilightedSource.split("\n");

  // hilightedSource = hilightedSource.map((line) => {
  //   return `<div class="line">${line}</div>`;
  // });

  // hilightedSource = hilightedSource.join("\n");
  hilightedSource = `<div class="source">${hilightedSource}</div>`;

  const sourcePage = await buildTemplate("txt.handlebars", {
    fileName,
    sketchPath,
    content: hilightedSource,
  });

  document.getElementById("source-frame").srcdoc = sourcePage;
}

async function buildNav(tree, path) {
  const pathParts = path.split("/");

  const folders = getFolders(tree, path);

  if (folders) {
    for (let i = 0; i < pathParts.length; i++) {
      const title = pathParts[i];
      const items = folders[i].children.map((child) => {
        let filePath = pathParts
          .slice(0, i)
          .concat(child.name)
          .join("/");
        return {
          title: child.name,
          href: `?sketch=${filePath}&source`,
          type: child.type,
        };
      });

      const el = buildDropdown({ title, items });
      document.getElementById("breadcrumbs").appendChild(el);
    }
  } else {
    const el = createElementFromHTML(`<div class="path">${path}</div>`);
    document.getElementById("breadcrumbs").appendChild(el);
  }
}

function defaultFile(tree, path) {
  const item = getItem(tree, path);

  if (!item) return path;
  if (item.type === "file") return path;
  if (item.children.length === 0) return path;

  if (path.length) {
    path = path + "/" + item.children[0].name;
  } else {
    path = item.children[0].name;
  }
  return defaultFile(tree, path);
}

function getItem(tree, path) {
  const pathParts = path.split("/");
  const items = [tree];
  for (const pathPart of pathParts) {
    if (pathPart === "") break;
    tree = tree.children.find((o) => o.name === pathPart);
    if (tree === undefined) return false;
    // if (tree.type === "file") break;
    items.push(tree);
  }
  return last(items);
}

function getFolders(tree, path) {
  const pathParts = path.split("/");
  const folders = [tree];
  for (const pathPart of pathParts) {
    if (pathPart === "") break;
    tree = tree.children.find((o) => o.name === pathPart);
    if (tree === undefined) return false;
    if (tree.type === "file") break;
    folders.push(tree);
  }
  return folders;
}

function buildDropdown(context) {
  const templateText = `
  <div class="dropdown">
    <div class="title">
      {{title}}
    </div>
    <ul class="items">
        {{#items}}
        <li class="{{this.type}}"><a href="{{this.href}}">{{this.title}}</a></li>
        {{/items}}
    </ul>
  </div>`;

  const template = Handlebars.compile(templateText);
  const markup = template(context);
  const el = createElementFromHTML(markup);
  return el;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

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
