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

  background(color) {
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(0, 0, this.width, this.height);
  }
}
