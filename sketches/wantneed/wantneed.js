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
// editedSentences = editedSentences.filter((p) => !p.includes("I to"));
// Have I to want what I don’t need?
editedSentences = editedSentences.filter((p) => !p.includes("I what"));
editedSentences = editedSentences.filter((p) => !p.includes("I I"));
editedSentences = editedSentences.filter((p) => !p.includes("I don't I"));
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
// editedSentences = editedSentences.filter((p) => !p.includes("have I"));
// Have I to want what I don’t need?
editedSentences = editedSentences.filter((p) => !p.includes("have don't"));
editedSentences = editedSentences.filter((p) => !p.includes("have want"));
editedSentences = editedSentences.filter((p) => !p.includes("have need"));
editedSentences = editedSentences.filter((p) => !p.startsWith("have"));

// what x
editedSentences = editedSentences.filter((p) => !p.includes("what want"));
// editedSentences = editedSentences.filter((p) => !p.includes("what don't"));
// I need to want. What don’t I have?

// don't x
editedSentences = editedSentences.filter((p) => !p.includes("don't to"));
editedSentences = editedSentences.filter((p) => !p.includes("don't what"));
editedSentences = editedSentences.filter((p) => !p.endsWith("don't"));

// need x
editedSentences = editedSentences.filter((p) => !p.includes("need I"));
editedSentences = editedSentences.filter((p) => !p.includes("need have"));
// editedSentences = editedSentences.filter((p) => !p.includes("need don't"));
// What need don’t I want to have?

editedSentences = editedSentences.filter((p) => !p.includes("need want"));
editedSentences = editedSentences.filter((p) => !p.startsWith("need"));

/// AI

import OpenAI from "https://deno.land/x/openai@v4.68.2/mod.ts";
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

const first1 = editedSentences.slice(0, 15);

for (const sentence of first1) {
  console.log(`Sentence: ${sentence}`);

  const params = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Evaluate the provided word sequences. Determine if those exact words in the exact order given could be made gramatical as one or two sentences. Punctuation can be added. Capitalization can be changed. But words cannot be changed, added, reordered, or removed. If they cannot be made grammatical, `punctuated` should be an empty string.",
        // content: "Is the following a grammatically correct sentence?",
      },
      {
        role: "user",
        content: sentence,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "grammatical",
        schema: {
          type: "object",
          properties: {
            grammatical: {
              type: "boolean",
              description: "Is the text grammatically correct?",
            },
            punctuated: {
              type: "string",
              description: "Punctuated version of the text.",
            },
          },
          required: ["grammatical", "punctuated"],
        },
      },
    },
  };
  const response = await openai.beta.chat.completions.parse(params);

  // console.log(response);
  console.log(response.choices[0].message.parsed);
}

// remove grammatically incorrect permutations

console.log(`Kept ${editedSentences.length} / ${uniqueSentences.length}`);

for (const p of editedSentences) {
  console.log(`${uniqueSentences.indexOf(p)}: ${capitalizeFirst(p)}.`);
}

//https://www.gregschomburg.com/gregfont/
