export default {
  load,
  defaultFile,
  getFolders,
  getItem,
};

async function load(data, initialPath) {
  const response = await fetch(data);
  const tree = {
    name: initialPath,
    type: "folder",
    children: await response.json(),
  };
  return tree;
}

function defaultFile(tree, path) {
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

function getFolders(tree, path) {
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

function getItem(tree, path) {
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
