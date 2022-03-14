// Tong, You've done a great job boiling down this problem
// and it looks like you've got a pretty clear picture of
// what is happening, and what you want to happen.

// I think things will fall into place for you when you understand
// that the value of _this_ is decided _when the function is called_
// and not _when the function is defined_

// also, this topic is complicated a bit by the difference between declaring functions with funciton and with ()=> arrow syntax.

// Lets focus on function() syntax.

// here an object is defined. It has a name property and a
// talk property. The value of this in talk isn't determined
// yet it is determined and can change based on how it is
// called.

let object1 = {
  name: "Abby",
  talk: function () {
    console.log(this);
    console.log("Hi, I'm " + this.name);
  },
};

// here we call the talk function _as a property of object 1_
// so _this_ will be object 1.

object1.talk(); // Hi, I'm Abby

// here we declare a variable and assign object1.talk to it.
let talkB = object1.talk;

// we now have two ways to reference _the same_ function.
// if we call the function using the new reference then
// _this_ won't be object 1. (It will be the window if we
// are not in strict mode)

talkB(); // Hi, I'm

// we can still call it the first way...

object1.talk(); // Hi, I'm Abby

// and it still works.

// So we can see that _this_ is determined at the time the
// function is called. If you call the function as a property
// of an object, that object becomes _this_.

// We can look at it kind of inside out too.
// here talkC is defined as a plain function.
function talkC() {
  console.log("Yo, I'm " + this.name);
}

// object 2's  talk property is assigned to talkC.
let object2 = {
  name: "Bob",
  talk: talkC,
};

talkC(); // Yo, I'm

object2.talk(); // Yo, I'm Bob

// when we have a callback situation (like setTimeout, or partySubscribe)
// run into an issue.

setTimeout(object1.talk, 1000); // delay: Hi, I'm

// after a delay setTimeout calls the function provided, but
// calls it directly and not as a property of object1, and
// _this_ isn't what we want.

// we can fix it like this:

setTimeout(object1.talk.bind(object1), 1000); // delay: Hi, I'm Abby

// the bind function configures the argument to setTimeout
// such that it will be called with _this_ set to object1.

// i've found that this book series does a good job digging
// into the details on things like _this_.

// https://github.com/getify/You-Dont-Know-JS
// https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/README.md
// https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch1.md
