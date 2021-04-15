// require https://unpkg.com/rita

/* globals RiTa */


const nns = RiTa.randomWord({
  numSyllables: 2,
});


const limerick = {
  start: "$first \n $second \n $third \n $fourth \n $fifth",
  $first: "There once was $aa.art $a $class",
  $second: "who was friends with $a.art $a $class.rhymes.",
  $third: "I'll make $a.art $nn",
  $fourth: "and then I'll be $nn.rhymes!",
  $fifth: "And that was the end of the $class!",
  $class: "wizard | ranger | cleric | rogue",
  aa: "angry | happy | stupid | silly | cranky | gleeful | frugal | clever | careful",
  a: "young | old | dumb | quick | sick | slow | sly",
  nn: nns,
};

const context = {};

// https://observablehq.com/@dhowe/scripting-rita/2#customTransforms
RiTa.addTransform("rhymes", (a)=>{
  const r = RiTa.rhymes(a, {
    limit: 100,
    // numSyllables: 2,
  });
  return pick(r) || "!oops!";
});


const g = RiTa.grammar(limerick, context);
say(g.expand());



function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}


function say(...strings){
  for (let s of strings) {
    console.log(s);
    const div = document.createElement("div");
    div.innerText = s;
    document.body.append(div);
  }
}