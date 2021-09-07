console.log("hello, world!");
console.log(document);

// i removed the actual email address from this before publishing to the repo.
const friends = [
  ["Munus", "Shih", "email"],
  ["Lingyi", "Zhou", "email"],
  ["Carla", "Sunji", "email"],
  ["Zoe", "Wilks", "email"],
  ["Jessie", "Han", "email"],
  ["Nikki", "Makagiansar", "email"],
  ["Lauria", "Clarke", "email"],
  ["Minghui", "Ju", "email"],
  ["Simone", "Liu", "email"],
  ["Bhuvaneesh", "Srivastava", "email"],
  ["Tee", "Topor", "email"],
  ["Nanwei", "Cai", "email"],
  ["Anna", "Osipov", "email"],
  ["Zhicun", "Wang", "email"],
  ["Sydney", "Goldberger", "email"],
  ["Ying", "Zhang", "email"],
  ["Yingyi", "Lei", "email"],
  ["Shamail", "Zahir", "email"],
  ["Ashley", "Heo", "email"],
  ["Lu", "Jia", "email"],
  ["Talia", "Cotton", "talia.email"],
  ["Justin", "Bakse", "email"],
];

// the main code
for (const friend of friends) {
  const first = friend[0];
  const last = friend[1];

  // find the alignments
  let alignments = getAlignments(first, last);

  // output debug info
  console.log(first, last, alignments);
  spit(first, last, JSON.stringify(alignments)).classList.add("debug");

  // create a card for each alignment found
  for (const alignment of alignments) {
    const first_pad = repeat(" ", alignment[1] - alignment[0]);
    const last_pad = repeat(" ", alignment[0] - alignment[1]);
    let card = spit(first_pad + first + "\n" + last_pad + last);
    card.classList.add("card");

    // scale to fill
    // let word_width = Math.max(
    //   (first_pad + first).length,
    //   (last_pad + last).length
    // );
    // card.style.fontSize = `${900 / word_width}px`;
  }
}

// create a string that repeats a given input a given number of times
// returns created string
function repeat(word, times) {
  let output = "";
  for (let i = 0; i < times; i++) {
    output += word;
  }
  return output;
}

// create a div, set its text to the given arguments, append to body
// returns div
function spit(...a) {
  const div = document.createElement("div");
  div.innerText = a.join(" ");
  document.body.appendChild(div);
  return div;
}

// takes two strings, and generates a report of where common letters occur in the string
// "test", "string" -> [[0,1,"t"],[2,0,"s"],[3,1,"t"]]
// returns report
function getAlignments(first_word, second_word) {
  const alignments = [];
  for (let i = 0; i < first_word.length; i++) {
    for (let ii = 0; ii < second_word.length; ii++) {
      if (first_word[i] === second_word[ii]) {
        alignments.push([i, ii, first_word[i]]);
      }
    }
  }
  return alignments;
}
