// off the common path
// https://caniuse.com/?search=page-break
// https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/
// https://developer.mozilla.org/en-US/docs/Web/CSS/Paged_Media
// https://css-tricks.com/almanac/properties/p/page-break/
// https://www.smashingmagazine.com/2011/11/how-to-set-up-a-print-style-sheet/
// Chrome Dev Tools > Rendering Drawer > Emulate CSS media...
// https://helpx.adobe.com/acrobat/using/printer-marks-hairlines-acrobat-pro.html
// https://codepen.io/cotton-t/pen/MWobROz
// https://drafts.csswg.org/css-page/
// https://css-tricks.com/almanac/properties/b/bleed/
// https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-print-color-adjust
// https://caniuse.com/?search=color-adjust
// https://www.sitepoint.com/css-printer-friendly-pages/
// https://www.quackit.com/css/properties/css_marks.cfm

// background: black
// - webkit chrome hack
// text fill width?
// code quality
// tools for you vs for others

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

for (const friend of friends) {
  const first = friend[0];
  const last = friend[1];
  let alignments = getAlignments(first, last);
  spit(first, last, JSON.stringify(alignments)).classList.add("debug");

  for (const alignment of alignments) {
    const first_pad = repeat(" ", alignment[1] - alignment[0]);
    const last_pad = repeat(" ", alignment[0] - alignment[1]);
    spit(first_pad + first + "\n" + last_pad + last).classList.add("card");
  }
}

function repeat(word, times) {
  let output = "";
  for (let i = 0; i < times; i++) {
    output += word;
  }
  return output;
}
function spit(...a) {
  const div = document.createElement("div");
  div.innerText = a.join(" ");
  document.body.appendChild(div);
  return div;
}

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
