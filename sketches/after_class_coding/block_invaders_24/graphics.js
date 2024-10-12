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
  #glCanvas;
  #gl;

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

    // Create WebGL2 canvas
    this.#glCanvas = document.createElement("canvas");
    this.#glCanvas.width = width;
    this.#glCanvas.height = height;
    this.#gl = this.#glCanvas.getContext("webgl2");
    if (!this.#gl) {
      throw new Error("WebGL2 not supported");
    }
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

  effect(frag, time) {
    const gl = this.#gl;
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;
      out vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      uniform sampler2D u_image;
      uniform float u_time;
      in vec2 v_texCoord;
      out vec4 outColor;
      ${frag}
      void main() {
        outColor = effect(texture(u_image, v_texCoord), u_time);
      }
    `;

    // Create shader program
    const vertexShader = this.#createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.#createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = this.#createProgram(gl, vertexShader, fragmentShader);

    // Set up attributes and uniforms
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
    const imageLocation = gl.getUniformLocation(program, "u_image");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0,
    ]), gl.STATIC_DRAW);

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Render
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);

    // Set up attribute pointers
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Upload the image to the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.#canvas);

    // Set the time uniform
    gl.uniform1f(timeLocation, time);

    // Render to the WebGL canvas
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Copy the result back to the 2D canvas
    this.#ctx.drawImage(this.#glCanvas, 0, 0);
  }

  #createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  #createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
    return program;
  }
}
