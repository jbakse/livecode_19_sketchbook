# TODO

# DIRTY

x. appending "sketches/" all over the place, probably just do that once at top
x. move the wrapper <div> and <pre> tags from show\*() to the .handlebars?
x. the sketchbook/js/\* modules export everything, narrow down

. tree probably needs a clean up. maybe change to oop?
. path, maybe change to oop?

. change "plugin" to "view"? or actually put some of the show\*() code in so they are more like plugins.
. shoudld the show\*() functions be DRYer? they all have the same general steps, and could be, but keeping them seperate makes it easier to handle special cases (maybe)

. get rid of highlight.js, move to prism.

# ORIGINAL FEATURE PLAN

x.creates table of contents of
n. /sketches/(sketch_name).js
n. /sketches/(sketch_name)/main|index|(sketch_name).js

x.nest folders? probably

start file name with \_ or maybe . to hide

top matter:
. // template -> uses the layout file named here or a default layout if none specfied
x. // require lib.js -> adds libs to html before loading script, from CDN, or $PATH
. // require lib.css -> should work with css too, from CDN, or $PATH

\$PATH -> search for template in current folder, then up folders to sketches, then /layouts (or whatever its called)
top matter should be human readable javascript comments
sketches should work outside the system too so the topmatter can't be YAML (maybe commented yaml)
should avoid loading libs already in template

?. auto include (sketch_name)|main|style.css
?. auto use (sketch_name)|index.html

---

example setup
include linter and formatter
