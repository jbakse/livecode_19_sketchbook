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
  let path = urlParams.get("sketch");
  path = defaultFile(tree, path);

  await buildNav(tree, path);

  // for .js sketches
  const sketchPath = "/sketches/" + path;
  const sketch = await getText(sketchPath);
  const directives = readDirectives(sketch);

  const context = {
    sketchPath,
    fileName: getFileName(path),
    fileTitle: getFileName(path).split(".")[0],
    fileExtensions: getFileName(path)
      .split(".")
      .splice(1),
    libraries: directives.libraries,
  };

  const page = await buildTemplate("layout.handlebars", context);

  document.getElementById("sketch-frame").srcdoc = page;
}

async function buildNav(tree, path) {
  const pathParts = path.split("/");
  console.log(path, pathParts);
  const directories = getDirectories(tree, path);

  if (directories) {
    for (let i = 0; i < pathParts.length; i++) {
      const title = pathParts[i];
      const items = directories[i].children.map((child) => {
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
  if (item.type === "file") return path;
  if (item.children.length === 0) return path;
  if (path) return path + "/" + item.children[0].name;
  return item.children[0].name;
}

function getItem(tree, path) {
  path = path || "";
  const pathParts = path.split("/");
  const directories = [tree];
  for (const pathPart of pathParts) {
    if (pathPart === "") break;
    tree = tree.children.find((o) => o.name === pathPart);
    if (tree === undefined) return false;
    // if (tree.type === "file") break;
    directories.push(tree);
  }
  return last(directories);
}

function getDirectories(tree, path) {
  path = path || "";
  const pathParts = path.split("/");
  const directories = [tree];
  for (const pathPart of pathParts) {
    if (pathPart === "") break;
    tree = tree.children.find((o) => o.name === pathPart);
    if (tree === undefined) return false;
    if (tree.type === "file") break;
    directories.push(tree);
  }
  return directories;
}

function buildDropdown(context) {
  const templateText = `
  <div class="dropdown">
    <div class="title">{{title}}</div>
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

/* <div class="dropdown">
  <div class="title">File</div>
  <ul class="items">
    <li><a href="#">Sub-1</a></li>
    <li><a href="#">Sub-2 A New Hope</a></li>
    <li><a href="#">Sub-3</a></li>
  </ul>
</div> */

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
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

function readDirectives(text) {
  const requireRegex = /^\/\/ ?require (.*?)$/gm;
  const libraries = [];
  let match_info;
  while ((match_info = requireRegex.exec(text))) {
    libraries.push(match_info[1]);
  }

  return { libraries };
}

async function buildTemplate(templatePath, context) {
  const templateResponse = await fetch(templatePath);
  const templateText = await templateResponse.text();
  const template = Handlebars.compile(templateText);
  const page = template(context);
  return page;
}
