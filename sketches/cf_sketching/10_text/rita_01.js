// require https://unpkg.com/rita

/* globals RiTa */

const nns = RiTa.randomWord({
  numSyllables: 2,
});

const grammar = {
  start:
    "The $adjective $adjective $animal $verb over the $adjective $adjective $animal.",
  adjective:
    "quick | brown | big | lazy | angry | happy | silly | cranky | gleeful | frugal | clever | careful",
  animal: "rabbit | dog | cat | bird | fish | cow",
  verb: "ran | jumped | swam | crawled | flew | danced",
};

const context = {};

const g = RiTa.grammar(grammar, context);

show(g.expand());

function show(...strings) {
  for (let s of strings) {
    console.log(s);
    const div = document.createElement("div");
    div.innerText = s;
    document.body.append(div);
  }
}
