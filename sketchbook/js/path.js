const Path = {
  filename(path) {
    const fileNameRegex = /[^/]+?(?=\?|$)/;
    const parts = fileNameRegex.exec(path);
    if (parts && parts.length) return parts[0];
    return "";
  },
  root(path) {
    return Path.filename(path)
      .split(".")
      .shift();
  },
  lastExtension(path) {
    const parts = Path.filename(path).split(".");
    if (parts.length > 1) return parts.pop();
    return undefined;
  },
  extensions(path) {
    const parts = Path.filename(path).split(".");
    if (parts.length > 1) return parts.splice(1).join(".");
    return undefined;
  },
};

export default Path;
