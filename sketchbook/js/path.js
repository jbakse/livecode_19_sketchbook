function name(path) {
  const fileNameRegex = /[^/]+?(?=\?|$)/;
  const parts = fileNameRegex.exec(path);
  if (parts && parts.length) return parts[0];
  return "";
}

function root(path) {
  return name(path)
    .split(".")
    .shift();
}

function lastExtension(path) {
  const parts = name(path).split(".");
  if (parts.length > 1) return parts.pop();
  return undefined;
}

function extensions(path) {
  const parts = name(path).split(".");
  if (parts.length > 1) return parts.splice(1).join(".");
  return undefined;
}

function info(path) {
  return {
    path: path,
    name: name(path),
    root: root(path),
    lastExtension: lastExtension(path),
    extensions: extensions(path),
  };
}

export default {
  name,
  root,
  lastExtension,
  extensions,
  info,
};
