console.log("Hello CFG!");

// pick
// choose an item from an array at random
function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}

// expand
// expands the string `s` using cfg rules in `rules`.
// depth controls how many maxiumum "rounds" of expansion
function expand(s, rules, depth = 5) {
  // don't expand this if we've reached out depth limit
  if (depth === 0) return s;

  // init the output
  let output = "";

  // split into parts between runs of whitespace and punctuation see: http://regexr.com/52ll0
  const separater = /([\s.?!,"]+)/;
  s.split(separater).forEach((part) => {
    // recursively expand part if matching rule exists
    if (Object.keys(rules).indexOf(part) > -1) {
      part = expand(pick(rules[part]), rules, depth - 1);
    }

    // add result to output
    output += part;
  });
  return output;
}

// make some rules
const rules = {
  insult: ["adverb adjective noun"],
  adverb: ["totally", "regretably"],
  adjective: ["adjective, adjective", "silly", "lumpy"],
  noun: ["carrot", "potato"],
};

// try them out
console.log(expand("You are a insult!", rules));
console.log(expand("You are a insult and a insult!", rules));
console.log(expand("You are a noun but not a noun.", rules));

// Dan Schiffman Makes somethign similar here:
// https://www.youtube.com/watch?v=8Z9FRiW2Jlc
// check it out for more explination
