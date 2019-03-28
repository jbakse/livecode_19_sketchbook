// console.log("hello, objects");

// let alexa = {
//   temp: 40,
//   light_status: "off"
// };

// let justin = Object.create(alexa);

// justin.last_name = "bakse";
// justin.temp = 12;

// console.log(justin.temp);
// console.log(justin.light_status);
// console.log(justin);
// console.log(alexa);
// console.log(justin instanceof Object);

function Person(name) {
  this.name = name;
}

Person.prototype.talk = function() {
  console.log(`I'm ${this.name}!`);
};

Person.prototype.sleep = function() {
  console.log(`zzz!`);
};

let myPerson = new Person("justin");
myPerson.talk();

// 1. Creates a new empty object
// 2. It sets the {} __proto__ delegate to the .prototype property of the constructor function
// 3. Runs the function, with the empty object bound to `this`
// 4. return the {}, or another object if explicitly returned by the constructor

console.log(myPerson);
