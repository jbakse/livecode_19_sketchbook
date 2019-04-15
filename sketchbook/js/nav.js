import Tree from "./tree.js";
/* globals Handlebars */

async function buildNav(tree, path) {
  const pathParts = path.split("/");

  const folders = Tree.getFolders(tree, path);

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

export default {
  buildNav,
};
