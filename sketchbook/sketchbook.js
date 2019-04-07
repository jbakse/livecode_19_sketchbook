/* global Handlebars */
console.log("Sketchbook");

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

  // for .js sketches
  const sketchPath = "../sketches/" + path;
  const sketch = await getText(sketchPath);
  const directives = readDirectives(sketch);

  const context = {
    sketchPath,
    fileName: getFileName(path),
    fileTitle: getFileName(path).split(".")[0],
    fileExtensions: getFileName(path)
      .split(".")
      .splice(1),
    libraries: directives.requires,
  };

  const page = await buildTemplate("layout.handlebars", context);

  document.getElementById("sketch-frame").srcdoc = page;
}

async function buildNav(tree, path) {
  const pathParts = path.split("/");
  console.log(path, pathParts);
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
          href: `?sketch=${filePath}`,
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
  console.log(item);

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
  console.log(path);
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
