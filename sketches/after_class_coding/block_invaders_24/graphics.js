function parseColorArgs(...args) {
  if (args.length === 1) {
    const color = args[0];
    if (typeof color === 'number') {
      // Single number: treat as grayscale (0-255)
      return `rgb(${color}, ${color}, ${color})`;
    } else if (Array.isArray(color)) {
      return arrayToRgba(color);
    }
    return color;
  } else if (args.length === 2) {
    // Two numbers: treat as grayscale and alpha
    const [gray, alpha] = args;
    return `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
  } else if (args.length === 3 || args.length === 4) {
    // Separate r, g, b, (a) arguments
    return arrayToRgba(args);
  } else {
    throw new Error("Invalid color format");
  }
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
