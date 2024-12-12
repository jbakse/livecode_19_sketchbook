/**
 * Loads a JSON file representing a directory structure.
 * JSON created by scripts/build_tree.js.
 *
 * @param {string} jsonFile - The path to the JSON file.
 * @returns {Promise<Object>} The directory structure as a tree object.
 */
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

/**
 * Returns the default file for a given path.
 *
 * If the path is a file, it returns the path.
 * If the path is a directory, it looks for a file or folder starting with "index".
 *
 * @param {Object} tree - The directory structure tree.
 * @param {string} path - The path to check.
 * @returns {string} The default file path.
 * @throws {Error} If the item is not found.
 */
export function defaultFile(tree, path) {
  const item = getItem(tree, path);

  // if the path doesn't exit
  if (!item) {
    // todo: handle this like a 404 somehow
    throw new Error(`Item not found: ${path}`);
  }

  // if it's a folder with no children,
  if (item.type === "folder" && item.children.length === 0) {
    // todo: handle this like a 404 somehow
    throw new Error(`Item not found: ${path}`);
    // console.log("returning path, no children", path);
    // return path;
  }

  // if the path leads to a file, return it as is
  if (item.type === "file") return path;

  // otherwise we have a folder
  // use the first child starting with index
  // if there isn't one use the first child
  const child =
    item.children.find((c) => c.name.startsWith("index")) ?? item.children[0];

  // get the path to the selected child
  const newPath = path.length ? path + "/" + child.name : child.name;

  // get the default for that child
  // if its a file it will be returned
  // if its a directory it will look for the default in that
  // this allows for something like index/index.md which might contain other resources
  return defaultFile(tree, newPath);
}

/**
 * Returns an array of the folders along the path.
 *
 * Example: "a/b/c.md.tx" -> [{a}, {b}]
 *
 * @param {Object} tree - The directory structure tree.
 * @param {string} path - The path to check.
 * @returns {Array<Object>|false} An array of folder objects or false if the path doesn't exist.
 */
export function getFolders(tree, path) {
  const pathParts = path.split("/");
  const folders = [tree];
  for (const pathPart of pathParts) {
    if (pathPart === "") continue;
    const currentTree = tree.children.find((o) => o.name === pathPart);
    if (currentTree === undefined) return false;
    if (currentTree.type === "file") break;
    folders.push(currentTree);
  }
  return folders;
}

/**
 * Given a tree/directory and a path, return the item matching the path.
 *
 * @param {Object} tree - The directory structure tree.
 * @param {string} path - The path to check.
 * @returns {Object|false} The item matching the path or false if the path doesn't exist.
 */
export function getItem(tree, path) {
  const pathParts = path.split("/");
  let currentTree = tree;

  for (const pathPart of pathParts) {
    if (pathPart === "") continue;
    currentTree = currentTree.children.find((o) => o.name === pathPart);
    if (currentTree === undefined) return false;
  }

  return currentTree;
}
