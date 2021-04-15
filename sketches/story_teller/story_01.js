console.log("Hello, dark night.");

function array_remove(a, item) {
  const index = a.indexOf(item);
  if (index > -1) {
    a.splice(index, 1);
  }
}
function array_pick(a) {
  return a[randomInt(a.length)];
}

function randomInt(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

// Fisher-Yates Shuffle
function array_shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const ii = randomInt(0, i + 1);
    [a[i], a[ii]] = [a[ii], a[i]];
  }
}

class Deck {
  constructor(a, keepShuffled = true) {
    this.a = a;
    this.keepShuffled = keepShuffled;
    if (this.keepShuffled) this.shuffle();
    this.index = 0;
  }

  shuffle() {
    array_shuffle(this.a, true);
  }

  next() {
    const value = this.a[this.index];
    this.index++;
    if (this.index === this.a.length) {
      if (this.keepShuffled) this.shuffle();
      this.index = 0;
    }
    return value;
  }

  nextUntil(v) {
    while (this.next() !== v) {
      //noop
    }
  }

  remove(v) {
    array_remove(this.a, v);
  }
}

class Character {
  constructor() {
    this.name = names.next();
    this.maxHP = 5;
    this.hp = this.maxHP;
  }


  act() {
    const target = array_pick(characters);
    let act_description = "";
    if (target === this) {
      act_description += `${this.description()} does nothing.`;
    } else {
      act_description += `${this.description()} swings at ${target.description()} and `;
      if (Math.random() > 0.5) {
        //hit
        const damage = randomInt(2, 5);
        if (damage > 3) {
          act_description += "hits very hard. ";
        } else {
          act_description += "hits. ";
        }
        act_description += target.damage(damage);
      } else {
        //miss
        act_description += "misses. ";
      }
    }

    return act_description;
  }

  damage(d) {
    const old_hp = this.hp;
    this.hp -= d;
    if (old_hp > this.maxHP * 0.5 && this.hp <= this.maxHP * 0.5) {
      return `${this.description()} is badly hurt. `;
    }
    if (old_hp > 0 && this.hp <= 0) {
      array_remove(characters, this);
      return `${this.description()} dies. `;
    }
    return "";
  }

  description() {
    return `${this.name}`;
    // return `${this.name}(${this.hp})`;
  }
}

const names = new Deck([
  "James",
  "John",
  "Robert",
  "Michael",
  "William",
  "David",
  "Richard",
  "Charles",
  "Joseph",
  "Thomas",
  "Mary",
  "Patricia",
  "Linda",
  "Barbara",
  "Elizabeth",
  "Jennifer",
  "Maria",
  "Susan",
  "Margaret",
  "Dorothy",
]);

const characters = [];

characters.push(new Character());
characters.push(new Character());
characters.push(new Character());

let story = "";
for (round = 0; round < 20; round++) {
  //   console.log("round");
  // determine initiative
  array_shuffle(characters);
  for (const c of characters) {
    // console.log("turn");
    story += c.act();
  }
}
say(story);



function say(...strings) {
  for (let s of strings) {
    console.log(s);
    const div = document.createElement("div");
    div.innerText = s;
    document.body.append(div);
  }
}