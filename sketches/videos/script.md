# Intro

Code with a few balls bouncing, called one by one.
Tour the code.

What if we want to step and draw EVERY ball in the array?

# Using a `for` loop

```javascript
for (let i = 0; i < balls.length; i++) {}
```

- This is probably the classic style for a loop
- C-style loop, popularized by the C programming language
- most people studying javascript learn first.
- `for (initialization; condition; increment) {}`
- the initialization is executed once before the loop starts
- the condition is checked
- the body of the loop is executed
- the increment is executed

- very flexible
- we can start with whatever initialization we want
  - this is usually `var = 0` or `var = 1`
  - but it _could_ be something else, like calling a function
- the condition can be whatever we want
  - usually this is `var < 10`
  - but it _could_ be something else, like multiple comparisons, calling a fuction that returns true/false, or ANYTHING
- the increment can be whatever we want

  - this is usually `var++`
  - but it can also be `var += 100` or `var *=2` or calling some funciton or ANYTHING

- this flexibility is very useful when you need it
- its a liability when you don't need it
  - error prone
  - hard to read
    - since it _could_ do almost anything
    - it _might_ do something you don't expect
  - noisy

# Using a `for...of` loop

```javascript
for (const b of balls) {
}
```

- introduced in ES6
- sorta new but widely supported
- `for (const variable of array) {}`

- it isn't as flexible as the C-style loop
- but that can be a benefit
  - much harder to mess up
  - easy to read, "only does one thing"
  - you don't need to init, increment, or check a variable
    - there is no variable to think about AT ALL

# Using `.forEach()`

```javascript
balls.forEach(...);
```

- introduced in ES5
- `array.forEach( function )`
- this is a "higher order function"
- it takes a function as an argument
- it calls the function on each element of the array

- this is even more concise than the for..of loop
- but it might be a little harder to read if you aren't used to using functions as data or aren't used to arrow functions
- these are good things to learn though
- once you are comfortable with .forEach you can start using related functions

  - .map - forEach and returns array of results
  - .filter - returns a new array with specific elements removed
  - .every - checks if every element in the array meets a condition
  - .some - checks if any element in the array meets a condition

# Conclusion

Our goal here is loop over every item in the array
and run some code on each item.

All three of these can do our task.

In this case I think the `for...of` loop is the best choice. - it is easy to write
you aren't likely to make a mistake - it is clear and easy to read
(you could probably understand it even if you've had never seen it before)
