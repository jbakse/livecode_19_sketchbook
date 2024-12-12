/* global Deno */

import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { name, root, lastExtension, extensions, directory } from "./path.js";

Deno.test("name function", () => {
  assertEquals(name("a/b/c.md.js"), "c.md.js");
  assertEquals(name("a/b/c.md.js?query=1"), "c.md.js");
  assertEquals(name("/a/b/c.md.js"), "c.md.js");
  assertEquals(name("c.md.js"), "c.md.js");
  assertEquals(name(""), "");
  assertEquals(name("/"), "");
  assertEquals(name("a/b/c."), "c.");
  assertEquals(name("a/b/.hiddenfile"), ".hiddenfile");
  assertEquals(name("a/b/c.d.e.f"), "c.d.e.f");
  assertEquals(name("abc"), "abc");
  assertThrows(() => name(123), TypeError, "Path must be a string");
  assertThrows(() => name(null), TypeError, "Path must be a string");
  assertThrows(() => name(undefined), TypeError, "Path must be a string");
});

Deno.test("root function", () => {
  assertEquals(root("a/b/c.md.js"), "c");
  assertEquals(root("a/b/c.md"), "c");
  assertEquals(root("a/b/c"), "c");
  assertEquals(root("a/b/c."), "c");
  assertEquals(root("a/b/.hiddenfile"), "");
  assertEquals(root("a/b/c.d.e.f"), "c");
  assertEquals(root(""), "");
  assertEquals(root("/"), "");
  assertThrows(() => root(123), TypeError, "Path must be a string");
  assertThrows(() => root(null), TypeError, "Path must be a string");
  assertThrows(() => root(undefined), TypeError, "Path must be a string");
});

Deno.test("lastExtension function", () => {
  assertEquals(lastExtension("a/b/c.md.js"), "js");
  assertEquals(lastExtension("a/b/c.md"), "md");
  assertEquals(lastExtension("a/b/c"), undefined);
  assertEquals(lastExtension("a/b/c."), "");
  assertEquals(lastExtension("a/b/.hiddenfile"), "hiddenfile");
  assertEquals(lastExtension("a/b/c.d.e.f"), "f");
  assertEquals(lastExtension(""), undefined);
  assertEquals(lastExtension("/"), undefined);
  assertThrows(() => lastExtension(123), TypeError, "Path must be a string");
  assertThrows(() => lastExtension(null), TypeError, "Path must be a string");
  assertThrows(
    () => lastExtension(undefined),
    TypeError,
    "Path must be a string"
  );
});

Deno.test("extensions function", () => {
  assertEquals(extensions("a/b/c.md.js"), "md.js");
  assertEquals(extensions("a/b/c.md"), "md");
  assertEquals(extensions("a/b/c"), undefined);
  assertEquals(extensions("a/b/c."), "");
  assertEquals(extensions("a/b/.hiddenfile"), "hiddenfile");
  assertEquals(extensions("a/b/c.d.e.f"), "d.e.f");
  assertEquals(extensions(""), undefined);
  assertEquals(extensions("/"), undefined);
  assertThrows(() => extensions(123), TypeError, "Path must be a string");
  assertThrows(() => extensions(null), TypeError, "Path must be a string");
  assertThrows(() => extensions(undefined), TypeError, "Path must be a string");
});

Deno.test("directory function", () => {
  assertEquals(directory("a/b/c.md.js"), "a/b/");
  assertEquals(directory("a/b/"), "a/b/");
  assertEquals(directory("a/b"), "a/");
  assertEquals(directory("../a/b/c.md.js"), "../a/b/");
  assertEquals(directory("/a/b/c.md.js"), "/a/b/");
  assertEquals(directory("a/b/c."), "a/b/");
  assertEquals(directory("a/b/.hiddenfile"), "a/b/");
  assertEquals(directory("a/b/c.d.e.f"), "a/b/");
  assertEquals(directory(""), "/");
  assertEquals(directory("/"), "/");
  assertThrows(() => directory(123), TypeError, "Path must be a string");
  assertThrows(() => directory(null), TypeError, "Path must be a string");
  assertThrows(() => directory(undefined), TypeError, "Path must be a string");
});
