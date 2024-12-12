import * as tree from "./tree.js";

export function buildNav(sketchTree, currentSketch) {
  // get each part of the path
  // a/b/c.md.js -> [a, b, c.md.js]
  const pathParts = currentSketch.split("/");
  if (pathParts[0] === "") {
    pathParts.shift();
  }

  // get the folders for each part of the path
  const folders = tree.getFolders(sketchTree, currentSketch);
  if (!folders) return;

  // create a breadcrumb menu for each part of the path
  for (const [i, title] of pathParts.entries()) {
    // sort the folder
    folders[i].children.sort((a, b) => {
      if (a.type === "file" && b.type === "folder") return -1;
      if (a.type === "folder" && b.type === "file") return 1;
      return 0;
    });

    // prepare data for the dropdown template
    const items = folders[i].children.map((child) => {
      const filePath = pathParts.slice(0, i).concat(child.name).join("/");
      const source = "";
      return {
        title: child.name,
        href: `?sketch=${filePath}&amp;${source}`,
        type: child.type,
      };
    });

    // build and append the dropdown
    const dropdownElement = buildDropdown({ title, items });
    document.getElementById("breadcrumbs").appendChild(dropdownElement);
  }
}

function buildDropdown(context) {
  // dropdown
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";

  // title
  const titleDiv = document.createElement("div");
  titleDiv.className = "title";
  titleDiv.textContent = context.title;
  dropdown.appendChild(titleDiv);

  // item list
  const ul = document.createElement("ul");
  ul.className = "items";

  // items
  context.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = item.type;

    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.title;

    li.appendChild(a);
    ul.appendChild(li);
  });

  dropdown.appendChild(ul);
  return dropdown;
}
