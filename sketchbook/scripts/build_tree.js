/* eslint-env node */
var DirectoryStructureJSON = require("directory-structure-json");
var basepath = "../sketches";
var fs = require("fs");

DirectoryStructureJSON.getStructure(fs, basepath, onStructure);

function onStructure(err, structure, total) {
  if (err) console.log(err);

  console.log(total);

  cleanItems(structure);
  sortItems(structure);
  structure = removeHiddenItems(structure);

  const structure_json = JSON.stringify(structure, null, 4);
  fs.writeFile("sketches_tree.json", structure_json, "utf8", () => {});
  // console.log("the structure looks like: ", structure_json);
}

function cleanItems(items) {
  // for some reason empty folders children are
  // returned as an {} instead of empty []
  // lets make it []

  items.forEach((item) => {
    if (item.type !== "folder") return;
    if (!Array.isArray(item.children)) {
      item.children = [];
    }
    cleanItems(item.children);
  });
}

function sortItems(items) {
  // this doesn't handle === right, but there
  // shouldn't be two items with the same name. right!?
  console.log(items);

  items.sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    return 0;
  });
  console.log("a", items);
  items.forEach(function (item) {
    if (item.type === "folder") {
      sortItems(item.children);
    }
  });
}

function removeHiddenItems(structure) {
  structure = structure.filter((object) => {
    // if (/*object.type === "file" &&*/ object.name.startsWith("_")) {
    //   console.log("remove file", object.name);
    //   return false;
    // }
    if (/*object.type === "file" &&*/ object.name.startsWith(".")) {
      console.log("remove file", object.name);
      return false;
    }
    return true;
  });
  structure.forEach(function (object) {
    if (object.type === "folder" && object.children.length > 0) {
      object.children = removeHiddenItems(object.children);
    }
  });
  return structure;
}
