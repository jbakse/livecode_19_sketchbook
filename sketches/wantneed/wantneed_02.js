function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function permute(items) {
  if (items.length === 0) return [[]];
  if (items.length === 1) return [items];

  const permutations = [];

  for (const currentItem of items) {
    const remainingItems = [...items];
    remainingItems.splice(items.indexOf(currentItem), 1);
    const remainingPermutations = permute(remainingItems);

    for (const permutation of remainingPermutations) {
      permutations.push([currentItem, ...permutation]);
    }
  }

  return permutations;
}

const sentence = "I want to have what I don't need";

const words = sentence.split(" ");

const permutations = permute(words);

const sentences = permutations.map((permutation) => permutation.join(" "));

const uniqueSentences = [...new Set(sentences)];

let editedSentences = [...uniqueSentences];

// I x
editedSentences = editedSentences.filter((p) => !p.includes("I what"));
editedSentences = editedSentences.filter((p) => !p.includes("I I"));
editedSentences = editedSentences.filter((p) => !p.includes("I don't I"));
editedSentences = editedSentences.filter((p) => !p.includes("I to"));
editedSentences = editedSentences.filter((p) => !p.endsWith("I"));

// want x
editedSentences = editedSentences.filter((p) => !p.includes("want I"));
editedSentences = editedSentences.filter((p) => !p.includes("want have"));
editedSentences = editedSentences.filter((p) => !p.includes("want don't"));
editedSentences = editedSentences.filter((p) => !p.includes("want need"));
editedSentences = editedSentences.filter((p) => !p.startsWith("want"));

// to x
editedSentences = editedSentences.filter((p) => !p.includes("to I"));
editedSentences = editedSentences.filter((p) => !p.includes("to don't"));
editedSentences = editedSentences.filter((p) => !p.endsWith("to"));
editedSentences = editedSentences.filter((p) => !p.startsWith("to"));

// have x
editedSentences = editedSentences.filter((p) => !p.includes("have don't"));
editedSentences = editedSentences.filter((p) => !p.includes("have want"));
editedSentences = editedSentences.filter((p) => !p.includes("have need"));
editedSentences = editedSentences.filter((p) => !p.startsWith("have"));

// what x
editedSentences = editedSentences.filter((p) => !p.includes("what want"));

// don't x
editedSentences = editedSentences.filter((p) => !p.includes("don't to"));
editedSentences = editedSentences.filter((p) => !p.includes("don't what"));
editedSentences = editedSentences.filter((p) => !p.endsWith("don't"));

// need x
editedSentences = editedSentences.filter((p) => !p.includes("need I"));
editedSentences = editedSentences.filter((p) => !p.includes("need have"));
editedSentences = editedSentences.filter((p) => !p.includes("need want"));
editedSentences = editedSentences.filter((p) => !p.startsWith("need"));

for (const p of editedSentences) {
  console.log(`${uniqueSentences.indexOf(p)}: ${capitalizeFirst(p)}.`);
}

const selections = [0, 4449, 15753];

for (selection of selections) {
  const punctuated = capitalizeFirst(uniqueSentences[selection]) + ".";

  const formatted = punctuated.match(/I\s\S+|\S+/g).join("\n");
  // const formatted = punctuated.match(/I\s\S+|\S+\sI|\S+/g).join("\n");

  console.log("");
  console.log(selection);

  console.log(`${formatted}`);
}

//https://www.gregschomburg.com/gregfont/
