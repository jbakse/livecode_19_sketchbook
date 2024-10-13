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
  #tintCache;
  #effectManager;

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

    this.#tintCache = new Map();

    // Create EffectManager
    this.#effectManager = new EffectManager(width, height);
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

  async loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
      img.src = url;
    });
  }

  image(img, [left, top, width, height], { smooth = false, tint = null } = {}) {
    // Save the current context state
    this.#ctx.save();

    // Set image smoothing based on the smooth parameter
    this.#ctx.imageSmoothingEnabled = smooth;
    if (!smooth) {
      left = Math.floor(left);
      top = Math.floor(top);
      width && (width = Math.floor(width));
      height && (height = Math.floor(height));
    }

    // Apply tint if specified
    if (tint) {
      img = this.tint(img, tint);
    }

    // Draw the image
    if (width !== undefined && height !== undefined) {
      this.#ctx.drawImage(img, left, top, width, height);
    } else {
      this.#ctx.drawImage(img, left, top);
    }

    // Restore the context state
    this.#ctx.restore();
  }

  tint(image, ...colorArgs) {
    const color = parseColorArgs(...colorArgs);
    const cacheKey = `${image.src}-${color}`;

    if (this.#tintCache.has(cacheKey)) {
      return this.#tintCache.get(cacheKey);
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(image, 0, 0);

    this.#tintCache.set(cacheKey, canvas);

    return canvas;
  }

  addEffect(name, shaderFunction) {
    this.#effectManager.addEffect(name, shaderFunction);
  }

  applyEffect(effectName) {
    this.#effectManager.applyEffect(this.#canvas, this.#ctx, effectName);
  }
}
