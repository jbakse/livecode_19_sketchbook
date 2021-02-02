#!/usr/bin/env node
/* eslint-env node */

var DirectoryStructureJSON = require("directory-structure-json");
var basepath = "../sketches";
var fs = require("fs");

DirectoryStructureJSON.getStructure(fs, basepath, onStructure);

function onStructure(err, structure, total) {
  if (err) console.log(err);

  console.log(
    "there are a total of: ",
    total.folders,
    " folders and ",
    total.files,
    " files"
  );
  structure = removeUnderscoreFiles(structure);

  const structure_json = JSON.stringify(structure, null, 4);
  fs.writeFile("sketches_tree.json", structure_json, "utf8", () => {});
  //   console.log("the structure looks like: ", structure_json);
}

function removeUnderscoreFiles(structure) {
  structure = structure.filter((object) => {
    if (object.type === "file" && object.name.startsWith("_")) {
      console.log("remove file", object.name);
      return false;
    }
    if (object.type === "file" && object.name.startsWith(".")) {
      console.log("remove file", object.name);
      return false;
    }
    return true;
  });
  structure.forEach(function (object) {
    if (object.type === "folder" && object.children.length > 0) {
      object.children = removeUnderscoreFiles(object.children);
    }
  });
  return structure;
}
