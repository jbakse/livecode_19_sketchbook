// Turtle

// Basic turtle graphics implementation:
// https://en.wikipedia.org/wiki/Turtle_graphics
// Written by Justin Bakse +  Alex Silva

console.log(
  "%c Comp Form %c Turtle ",
  "color: white; background-color: black;",
  "color: black; background-color: white;"
);

class Turtle {
  #stateStack;
  #turtleElement; // Private reference to the turtle element (polygon)

  constructor(x = width * 0.5, y = height * 0.5) {
    this.x = x;
    this.y = y;
    this.bearing = 0;
    this.isPenDown = true;
    this.#stateStack = [];

    this.#createTurtleE();
    this.hide();
  }

  #createTurtleE() {
    const canvasContainer = document.querySelector("canvas").parentElement;

    // Create the SVG element as a string and append it to the container
    const svgSource = `
      <svg 
        width="100%"
        height="100%"
        style="position: absolute; top: 0; left: 0; z-index: 1; mix-blend-mode: difference;"
      >
        <polygon points="0,-15 8,5 -8,5" fill="white" stroke="white"/>
      </svg>
    `;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgSource.trim();
    const svgElement = tempDiv.firstChild;

    // Store the polygon reference
    this.#turtleElement = svgElement.querySelector("polygon");

    // Append the SVG to the canvas container
    canvasContainer.appendChild(svgElement);

    this.#updateTurtleE();
  }

  #updateTurtleE() {
    // Set new position and rotation
    this.#turtleElement.setAttribute(
      "transform",
      `translate(${this.x}, ${this.y}) rotate(${this.bearing + 90})`
    );
    this.#turtleElement.setAttribute("fill", this.isPenDown ? "white" : "none");
  }

  // moveTo
  moveTo(newX, newY) {
    if (this.isPenDown) {
      line(this.x, this.y, newX, newY);
    }
    this.x = newX;
    this.y = newY;

    this.#updateTurtleE();
  }

  // moveForward
  moveForward(distance) {
    const newX = this.x + cos(this.bearing) * distance;
    const newY = this.y + sin(this.bearing) * distance;
    this.moveTo(newX, newY);
  }

  // moveBackward
  moveBackward(distance) {
    this.moveForward(-distance);
  }

  // turnTo
  turnTo(angleDegrees) {
    this.bearing = angleDegrees;
    this.#updateTurtleE();
  }

  // turnRight
  turnRight(amountDegrees) {
    this.turnTo(this.bearing + amountDegrees);
  }

  // turnLeft
  turnLeft(amountDegrees) {
    this.turnRight(-amountDegrees);
  }

  // penUp
  penUp() {
    this.isPenDown = false;
  }

  // penDown
  penDown() {
    this.isPenDown = true;
  }

  // pushState
  pushState() {
    this.#stateStack.push({
      x: this.x,
      y: this.y,
      bearing: this.bearing,
      isPenDown: this.isPenDown,
    });
  }

  // popState
  popState() {
    if (this.#stateStack.length === 0) {
      console.error(
        "Turtle: No states left on stack. Make sure your calls to .pushState and .popState are balanced."
      );
      return;
    }
    const state = this.#stateStack.pop();
    this.x = state.x;
    this.y = state.y;
    this.bearing = state.bearing;
    this.isPenDown = state.isPenDown;
    this.#updateTurtleE();
  }

  // image
  image(i, w, h) {
    push();
    translate(this.x, this.y);
    rotate(this.bearing + PI * 0.5);
    imageMode(CENTER);
    image(i, 0, 0, w, h);
    pop();
  }

  // show - Makes the turtle visible
  show(shouldShow = true) {
    if (shouldShow) {
      this.#turtleElement.style.display = "block";
    } else {
      this.#turtleElement.style.display = "none";
    }
  }

  // hide - Hides the turtle
  hide() {
    this.show(false);
  }
}
