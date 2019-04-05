creates table of contents of
/sketches/(sketch_name).js
/sketches/(sketch_name)/main|index|(sketch_name).js

nest folders? probably

start file name with \_ or maybe . to hide

should support

top mater:
// template -> uses the layout file named here or a default layout if none specfied
// require lib.js -> adds libs to html before loading script, from CDN, or $PATH
// require lib.css -> should work with css too, from CDN, or $PATH

\$PATH -> search for template in current folder, then up folders to sketches, then /layouts (or whatever its called)
top matter should be human readable javascript comments
sketches should work outside the system too so the topmatter can't be YAML (maybe commented yaml)
should avoid loading libs already in template

auto include (sketch_name)|main|style.css
auto use (sketch_name)|index.html

---

example setup
include linter and formatter
