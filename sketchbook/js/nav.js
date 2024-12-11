import * as tree from "./tree.js";
/* globals Handlebars */

export function buildNav(_tree, path) {
  const pathParts = path.split("/");
  if (pathParts[0] === "") {
    pathParts.shift();
  }

  const folders = tree.getFolders(_tree, path);

  // console.log("pathParts", pathParts);
  // console.log("folders", folders);

  if (folders) {
    for (let i = 0; i < pathParts.length; i++) {
      const title = pathParts[i];

      folders[i].children.sort((a, b) => {
        if (a.type === "file" && b.type === "folder") return -1;
        if (a.type === "folder" && b.type === "file") return 1;
        return 0;
      });
      const items = folders[i].children.map((child) => {
        const filePath = pathParts.slice(0, i).concat(child.name).join("/");
        const source = "";
        return {
          title: child.name,
          href: `?sketch=${filePath}&amp;${source}`,
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
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
