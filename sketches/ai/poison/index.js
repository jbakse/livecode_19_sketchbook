/* globals React ReactDOM */

console.log("hello, poison_gpt.js");

const poisonIngredients = [
  "Belladonna",
  "Hemlock",
  "Monkshood",
  "Jimsonweed",
  "Foxglove",
  "Oleander",
  "Yew",
  "Castor Bean",
  "Larkspur",
  "Water Hemlock",
];
const mundaneIngredients = [
  "Chamomile",
  "Lavender",
  "Peppermint",
  "Echinacea",
  "Ginger",
  "Calendula",
  "Rose",
  "Hibiscus",
  "Lemon balm",
  "St John's Wort",
];

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "black"];
const shapes = ["round", "square", "oval", "cylindrical", "pyramidal"];
const materials = ["glass", "plastic", "metal", "ceramic", "wood"];

const ReactAppFromCDN = () => {
  const [stats, setStats] = React.useState(0);

  function generateEffect() {
    const effect = {
      attribute: pick([
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
      ]),
      buff: pick(["+1", "-1", "-1", "-1", "-2"]),
      duration: pick(["1 round", "1 minute", "1 hour", "1 day"]),
    };
    return effect;
  }
  function makePoison() {
    console.log("makePoison");

    const poison = {
      type: "poison",
      // name: "poison",
      // description: "poison",
      effects: [generateEffect(), generateEffect()],
      ingredients: [].concat(
        sample(poisonIngredients, 1),
        sample(mundaneIngredients, 2)
      ),
      bottle: [].concat(
        sample(colors, 1),
        sample(shapes, 1),
        sample(materials, 1)
      ),
    };
    console.log(poison);

    // set stats to poison
    setStats(poison);
  }

  return (
    <div>
      <button onClick={makePoison}>Make Poison</button>
      <ShowJSON json={stats} />
    </div>
  );
};

const ShowJSON = ({ json }) => <pre>{JSON.stringify(json, null, 2)}</pre>;

ReactDOM.render(<ReactAppFromCDN />, document.querySelector("#root"));

// pick, chooses a random element from an array
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// sample, chooses n random elements from an array without repeats
// does not alter input array
function sample(arr, n) {
  const result = [];
  const copy = arr.slice();
  while (n--) {
    result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return result;
}
