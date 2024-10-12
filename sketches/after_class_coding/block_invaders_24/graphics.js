function parseColorArgs(...args) {
  if (args.length === 1) {
    const firstArgument = args[0];
    if (typeof firstArgument === "number") {
      // Single number: treat as grayscale (0-255)
      return `rgb(${firstArgument}, ${firstArgument}, ${firstArgument})`;
    }
    if (Array.isArray(firstArgument)) {
      return arrayToRgba(firstArgument);
    }
    if (typeof firstArgument === "string") {
      return firstArgument;
    }
    throw new Error("Invalid single argument color format");
  }

  if (args.length === 2) {
    // Two numbers: treat as grayscale and alpha
    if (args.every((arg) => typeof arg === "number")) {
      const [gray, alpha] = args;
      return `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
    }
    throw new Error("Invalid two-argument color format");
  }

  if (args.length === 3 || args.length === 4) {
    // Separate r, g, b, (a) arguments
    if (args.every((arg) => typeof arg === "number")) {
      return arrayToRgba(args);
    }
    throw new Error("Invalid three or four-argument color format");
  }

  throw new Error("Invalid number of arguments for color");
}

function arrayToRgba(arr) {
  const r = Math.round(arr[0]);
  const g = Math.round(arr[1]);
  const b = Math.round(arr[2]);
  const a = arr[3] !== undefined ? arr[3] : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export class Graphics {
  #canvas;
  #ctx;

  constructor(width, height) {
    this.#canvas = document.createElement("canvas");
    this.#ctx = this.#canvas.getContext("2d");
    this.#canvas.id = "block-invaders";
    this.#canvas.width = width;
    this.#canvas.height = height;
    document.body.appendChild(this.#canvas);

    const styles = document.createElement("style");
    styles.textContent = `
      #block-invaders {
        border: none;
        width: 1024px;
        height: 1024px;
        image-rendering: pixelated;
        border-radius: 8px;
      }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background: #111;
     }
    `;
    document.head.appendChild(styles);
  }

  get width() {
    return this.#canvas.width;
  }

  get height() {
    return this.#canvas.height;
  }

  background(...args) {
    const color = parseColorArgs(...args);
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(0, 0, this.width, this.height);
  }
}
