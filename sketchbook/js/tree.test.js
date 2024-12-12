/* global Deno */

import { assertEquals, assertThrows } from "jsr:@std/assert";
import { defaultFile, getFolders, getItem } from "./tree.js";

// Small test tree object based on sketches_tree
const testTree = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "folder1",
      type: "folder",
      children: [
        { type: "file", name: "file1.js" },
        { type: "file", name: "index.html" },
      ],
    },
    {
      name: "folder2",
      type: "folder",
      children: [{ type: "file", name: "file2.js" }],
    },
    { type: "file", name: "index.md" },
  ],
};

// Test valid paths
Deno.test("defaultFile - valid paths", () => {
  assertEquals(defaultFile(testTree, "folder1"), "folder1/index.html");
  assertEquals(defaultFile(testTree, "folder2"), "folder2/file2.js");
  assertEquals(defaultFile(testTree, ""), "index.md");
});

// Test invalid paths
Deno.test("defaultFile - invalid paths", () => {
  assertThrows(
    () => defaultFile(testTree, "nonexistent"),
    Error,
    "Item not found: nonexistent"
  );
  assertThrows(
    () => defaultFile(testTree, "folder2/nonexistent"),
    Error,
    "Item not found: folder2/nonexistent"
  );
});

// Test getFolders
Deno.test("getFolders", () => {
  assertEquals(getFolders(testTree, "folder1/file1.js"), [
    testTree,
    testTree.children[0],
  ]);
  assertEquals(getFolders(testTree, "folder2/file2.js"), [
    testTree,
    testTree.children[1],
  ]);
  assertEquals(getFolders(testTree, "index.md"), [testTree]);
  assertEquals(getFolders(testTree, "nonexistent"), false);
});

// Test getItem
Deno.test("getItem", () => {
  assertEquals(
    getItem(testTree, "folder1/file1.js"),
    testTree.children[0].children[0]
  );
  assertEquals(
    getItem(testTree, "folder2/file2.js"),
    testTree.children[1].children[0]
  );
  assertEquals(getItem(testTree, "index.md"), testTree.children[2]);
  assertEquals(getItem(testTree, "nonexistent"), false);
});
