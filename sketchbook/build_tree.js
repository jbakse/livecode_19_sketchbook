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
  const structure_json = JSON.stringify(structure, null, 4);
  fs.writeFile("sketches_tree.json", structure_json, "utf8", () => {});
  //   console.log("the structure looks like: ", structure_json);
}
