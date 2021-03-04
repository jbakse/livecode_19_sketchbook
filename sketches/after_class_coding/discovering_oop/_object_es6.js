class Person {
  constructor(name) {
    this.name = name;
  }

  talk() {
    console.log(`I'm ${this.name}!`);
  }

  sleep() {
    console.log("zzzzz.");
  }
}

class Boss extends Person {
  constructor(name) {
    super(name);
  }

  talk() {
    console.log(`I'm ${this.name}! Get to work!`);
  }
}

// none of this crap
// // bind the prototype chain
// Boss.prototype = Object.create(Person.prototype);

// // set the constructor property in case something asks later
// Object.defineProperty(Boss.prototype, "constructor", {
//   value: Boss,
//   enumerable: false,
//   writable: true
// });

let myPerson = new Person("Dave");
console.log(myPerson);
console.log(myPerson.name);
myPerson.talk();
myPerson.sleep();
console.log(myPerson instanceof Person);
console.log(myPerson instanceof Boss);

let myBoss = new Boss("Carol");
console.log(myBoss);
console.log(myBoss.name);
myBoss.talk();
myBoss.sleep();
console.log(myBoss instanceof Person);
console.log(myBoss instanceof Boss);
console.log(Boss.prototype);
