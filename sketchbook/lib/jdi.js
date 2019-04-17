// adapted from https://github.com/alexanderGugel/jdi/blob/master/index.js
// -js

// ## regular expressions
// ### `isDoc`
// `isDoc` matches comments starting with `//`. Whitespace is being ignored.
const isDoc = /^\s*\/\/\s*/;
// ### `isBlank`
// `isBlank` matches lines containing only whitespace characters, such as tabs
// or spaces.
const isBlank = /^\s*$/;
// ### `isShebang`
// `isShebang` matches lines that start with the shebang character sequence. See
// [Shebang (Unix)](https://de.wikipedia.org/wiki/Shebang) explaining the syntax
// of the directive itself.
const isShebang = /^#!/;
// ### `isIgnored`
// `isIgnored` matches lines that end with "jdi-disable-line". This is inspired
// by `eslint`'s `eslint-disable-line` directive.
const isIgnored = /^.*jdi-disable-line$/;

// ## `transformFunction`
function js2md(text, extname = "js") {
  text = text.split("\n");
  let md = [];
  let wasCodeBlock = false;
  let isCodeBlock = false;
  for (const chunk of text) {
    // ### blank lines
    // We ignore empty lines in order to avoid creating excessive code blocks.
    // Empty lines are being preserved in the transformed `.md` file. They can
    // be used for separating sections.
    if (isBlank.test(chunk)) {
      md.push(chunk);

      continue;
    }

    // ### ignored lines
    // Check if line ends with jdi-disable-line.
    if (isIgnored.test(chunk)) {
      // If jdi should ignore this line, `cb()` without pushing `chunk`.
      continue;
    }

    // ### code blocks
    // Check if we are currently in a code block. Everything that is **not** a
    // comment can be considered to be a code block.
    wasCodeBlock = isCodeBlock;
    isCodeBlock = !isDoc.test(chunk);

    // Did we just start a code block?
    if (isCodeBlock && !wasCodeBlock) {
      // If yes, append ``\`\`\`${extname}` to start the code block.
      md.push("```" + extname);
    }

    // Did we just close a code block?
    if (!isCodeBlock && wasCodeBlock) {
      // If yes, append `\`\`\`` to close the code block.
      // remove trailing empty line in code -jb
      if (md[md.length - 1] === "") {
        md.pop();
      }
      md.push("```");
    }

    // Are we currently in a code block?
    if (isCodeBlock) {
      // If yes, just pass the chunk through.
      md.push(chunk);
    } else {
      // Otherwise, we're in a comment (= documentation). We remove the
      // comment prefix and trailing whitespace (typically `// `).
      // That way `// # title` becomes `# title`.
      md.push(String(chunk).replace(isDoc, ""));
    }
  }

  if (isCodeBlock) {
    md.push("```");
  }

  return md.join("\n");
}
