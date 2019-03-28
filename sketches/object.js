// read more https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects

console.log("Hello, object.js");

let myPrototypeObject = {};
myPrototypeObject.temp = 22;

// create an object and assign the prototype
// don't do this though, __proto__ is system internal, and you shouldn't mess with it
// let myObject = {};
// myObject.__proto__ = myPrototypeObject;

// this is a bit better, but still pretty slow and makes code hard to read
// generally you should set the prototype at creation time, and never change it
// let myObject = {};
// Object.setPrototypeOf(myObject, myPrototypeObject);

// do it this way, much better
let myObject = Object.create(myPrototypeObject);

myObject.fruit = "apple";

console.log(myObject);
console.log(myObject.fruit);
console.log(myObject.temp);
console.log(myObject.animal);
console.log("prototype is", Object.getPrototypeOf(myObject));

function MyConstructor() {
  this.animal = "bear";
}

// don't overwrite MyConstructor.prototype
// MyConstructor.prototype = myPrototypeObject;

let myConstructedObject = new MyConstructor();

console.log(myConstructedObject);
console.log(myConstructedObject.animal);
console.log(myConstructedObject.temp);

console.log(MyConstructor.prototype.constructor);

// Its quite a shuffle
//developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance

function Person(name) {
  this.name = name;
}

Person.prototype.talk = function() {
  console.log(`I'm ${this.name}!`);
};

Person.prototype.sleep = function() {
  console.log("zzzzz.");
};

// create another constructor
function Boss(name) {
  // call the parent/super constructor
  Person.call(this, name);
}

// bind the prototype chain
Boss.prototype = Object.create(Person.prototype);

// set the constructor property in case something asks later
Object.defineProperty(Boss.prototype, "constructor", {
  value: Boss,
  enumerable: false,
  writable: true
});

Boss.prototype.talk = function() {
  console.log(`I'm ${this.name}! Get to work!`);
};

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
console.log(Boss.prototype.constructor);
