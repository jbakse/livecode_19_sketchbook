export async function load(jsonFile) {
  const response = await fetch(jsonFile);
  const tree = {
    name: "root",
    type: "folder",
    children: await response.json(),
  };
  console.log("tree", tree);
  return tree;
}

export function defaultFile(tree, path) {
  const item = getItem(tree, path);

  if (!item) return path;
  if (item.type === "file") return path;
  if (item.children.length === 0) return path;

  let child = item.children[0];
  for (const c of item.children) {
    if (c.name.startsWith("index")) child = c;
  }

  if (path.length) {
    path = path + "/" + child.name;
  } else {
    path = child.name;
  }
  return defaultFile(tree, path);
}

export function getFolders(tree, path) {
  const pathParts = path.split("/");
  const folders = [tree];
  for (const pathPart of pathParts) {
    if (pathPart === "") continue;
    tree = tree.children.find((o) => o.name === pathPart);
    if (tree === undefined) return false;
    if (tree.type === "file") break;
    folders.push(tree);
  }
  return folders;
}

//////////////////////////////////////////////////////////////////////
// Private

export function getItem(tree, path) {
  const pathParts = path.split("/");
  const items = [tree];

  for (const pathPart of pathParts) {
    if (pathPart === "") continue;
    tree = tree.children.find((o) => o.name === pathPart);
    if (tree === undefined) return false;
    // if (tree.type === "file") break;
    items.push(tree);
  }

  return items[items.length - 1];
}
