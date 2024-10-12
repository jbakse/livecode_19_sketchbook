function parseColorArgs(...args) {
  if (args.length === 1) {
    const firstArgument = args[0];
    if (typeof firstArgument === "string") {
      return firstArgument;
    }
    if (typeof firstArgument === "number") {
      return arrayToRgba([firstArgument]);
    }
    if (Array.isArray(firstArgument)) {
      return arrayToRgba(firstArgument);
    }

    throw new Error("Invalid single argument color format");
  }

  if (args.length === 2 || args.length === 3 || args.length === 4) {
    if (args.every((arg) => typeof arg === "number")) {
      return arrayToRgba(args);
    }
    throw new Error("Invalid color format");
  }

  throw new Error("Invalid number of arguments for color");
}

function arrayToRgba(arr) {
  if (!Array.isArray(arr) || !arr.every((n) => typeof n === "number")) {
    throw new Error("Invalid input: expected an array of numbers");
  }

  switch (arr.length) {
    case 1:
      return `rgb(${arr[0]}, ${arr[0]}, ${arr[0]})`;
    case 2:
      return `rgba(${arr[0]}, ${arr[0]}, ${arr[0]}, ${arr[1] / 255})`;
    case 3:
      return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
    case 4:
      return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3] / 255})`;
    default:
      throw new Error("Invalid input: array length must be 1, 2, 3, or 4");
  }
}

export class Graphics {
  #canvas;
  #ctx;
  #images = {};

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

  background(...colorArgs) {
    const color = parseColorArgs(...colorArgs);
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(0, 0, this.width, this.height);
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.width, this.height);
  }

  async loadImage(name, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.#images[name] = img;
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  image(name, left, top, width, height, tint) {
    const img = this.#images[name];
    if (!img) {
      console.error(`Image '${name}' not found`);
      return;
    }

    if (tint) {
      this.#ctx.save();
      this.#ctx.fillStyle = tint;
      this.#ctx.globalCompositeOperation = 'multiply';
      this.#ctx.fillRect(left, top, width, height);
      this.#ctx.globalCompositeOperation = 'destination-atop';
      this.#ctx.drawImage(img, left, top, width, height);
      this.#ctx.restore();
    } else {
      this.#ctx.drawImage(img, left, top, width, height);
    }
  }
}
