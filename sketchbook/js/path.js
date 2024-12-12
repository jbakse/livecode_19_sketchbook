/**
 * Extracts the filename from a path string.
 * Example: a/b/c.md.js -> c.md.js
 *
 * @param {string} path - Path containing the filename.
 * @returns {string} Extracted filename or empty string if not found.
 * @throws {TypeError} If path is not a string.
 */
export function name(path) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");

  const withoutQuery = path.split("?")[0];
  const fileName = withoutQuery.split("/").at(-1);
  return fileName ?? "";
}

/**
 * Returns the filename without extensions.
 * Example: a/b/c.md.js -> c
 *
 * @param {string} path - Path containing the filename.
 * @returns {string} Filename without extensions.
 * @throws {TypeError} If path is not a string.
 */
export function root(path) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");
  return name(path).split(".").shift();
}

/**
 * Returns the last extension.
 * Example: a/b/c.md.js -> js
 *
 * @param {string} path - Path containing the filename.
 * @returns {string|undefined} Last extension or undefined if not found.
 * @throws {TypeError} If path is not a string.
 */
export function lastExtension(path) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");
  const parts = name(path).split(".");
  if (parts.length > 1) return parts.pop();
  return undefined;
}

/**
 * Returns all extensions.
 * Example: a/b/c.md.js -> md.js
 *
 * @param {string} path - Path containing the filename.
 * @returns {string|undefined} All extensions or undefined if not found.
 * @throws {TypeError} If path is not a string.
 */
export function extensions(path) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");
  const parts = name(path).split(".");
  if (parts.length > 1) return parts.splice(1).join(".");
  return undefined;
}

/**
 * Returns the directory.
 * Example: a/b/c.md.js -> a/b/
 *
 * @param {string} path - Path containing the filename.
 * @returns {string} Directory path.
 * @throws {TypeError} If path is not a string.
 */
export function directory(path) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");
  const parts = path.split("/");
  parts.pop();

  return parts.join("/") + "/";
}

/**
 * Returns all info about a path.
 *
 * @param {string} path - Path containing the filename.
 * @returns {Object} Object containing path, name, root, lastExtension, extensions, and directory.
 * @throws {TypeError} If path is not a string.
 */
export function info(path) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");
  return {
    path,
    name: name(path),
    root: root(path),
    lastExtension: lastExtension(path),
    extensions: extensions(path),
    directory: directory(path),
  };
}
