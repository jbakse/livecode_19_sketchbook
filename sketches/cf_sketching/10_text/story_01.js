// require https://unpkg.com/rita

/* globals RiTa */

const storyGrammar = {
  start: "First, $phrase. Then, $phrase. Finally, $phrase, and $phrase.",
  phrase: "$subject.art $verb $object.art",
  subject: "$noun | $adjective $noun",
  object:
    "$noun | $adjective $noun | $adjective $noun and $adverb.art $adjective $noun",
  adverb: "exceptionally | somewhat",
  adjective: "proud | small | forgetful | handsome | comical | wild",
  noun: "bear | cat | dog | frog | goose | lamb | rabbit",
  verb: "becomes friends with | finds | chases | plots with",
};

const context = {};

const g = RiTa.grammar(storyGrammar, context);

show(g.expand());

function show(...strings) {
  for (const s of strings) {
    console.log(s);
    const div = document.createElement("div");
    div.innerText = s;
    document.body.append(div);
  }
}
