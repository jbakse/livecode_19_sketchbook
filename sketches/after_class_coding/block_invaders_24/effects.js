// glsl template tag for shader string tagging
const glsl = (strings, ...expressions) =>
  strings.reduce((acc, str, i) => acc + str + (expressions[i] || ""), "");

export class EffectManager {
  constructor(width, height) {
    // Initialize properties
    this.width = width;
    this.height = height;
    this.startTime = performance.now();

    // Create hidden canvas and get WebGL2 context
    this.glCanvas = document.createElement("canvas");
    this.glCanvas.width = width;
    this.glCanvas.height = height;
    this.gl = this.glCanvas.getContext("webgl2");
    if (!this.gl) {
      throw new Error("WebGL2 is not supported in this environment.");
    }

    // Initialize caches
    this.effectCache = new Map();

    // Initialize buffers and VAO
    this._initBuffers();

    // Initialize texture
    this._initTexture();
  }

  /**
   * Initializes vertex and texture coordinate buffers and sets up a VAO.
   * This setup is reused for all effect applications.
   */
  _initBuffers() {
    const gl = this.gl;

    // Define full-screen quad vertices
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    // Define texture coordinates
    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);

    // Create and bind Vertex Array Object
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Create and bind position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // Position attribute location will be set per program

    // Create and bind texture coordinate buffer
    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    // Texture coordinate attribute location will be set per program

    // Unbind VAO to prevent accidental modifications
    gl.bindVertexArray(null);
  }

  /**
   * Initializes a single texture to be reused for all effect applications.
   */
  _initTexture() {
    const gl = this.gl;

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Allocate texture storage (empty initially)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.width,
      this.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    // Unbind texture to prevent accidental modifications
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * Creates or retrieves a cached shader program based on the fragment shader source.
   * @param {string} fragmentShaderSource - The fragment shader GLSL code.
   * @returns {object} - An object containing the shader program and uniform locations.
   */
  createEffect(fragmentShaderSource) {
    // Check if the effect is already cached
    if (this.effectCache.has(fragmentShaderSource)) {
      return this.effectCache.get(fragmentShaderSource);
    }

    const gl = this.gl;

    // Define the standard vertex shader
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;
      out vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Ensure the fragment shader defines an 'effect' function
    if (!/vec4\s+effect\s*\(/.test(fragmentShaderSource)) {
      throw new Error(
        "Fragment shader must define a 'vec4 effect(...)' function."
      );
    }

    // Complete fragment shader by wrapping the user-provided effect
    const fullFragmentShaderSource = `#version 300 es
      precision highp float;
      uniform sampler2D u_image;
      uniform float u_time;
      in vec2 v_texCoord;
      out vec4 outColor;

      ${fragmentShaderSource}

      void main() {
        outColor = effect(u_image, v_texCoord, u_time);
      }
    `;

    // Compile shaders
    const vertexShader = this._compileShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this._compileShader(
      gl.FRAGMENT_SHADER,
      fullFragmentShaderSource
    );

    // Link shaders into a program
    const program = this._linkProgram(vertexShader, fragmentShader);

    // Get attribute and uniform locations
    const attributes = {
      position: gl.getAttribLocation(program, "a_position"),
      texCoord: gl.getAttribLocation(program, "a_texCoord"),
    };

    const uniforms = {
      image: gl.getUniformLocation(program, "u_image"),
      time: gl.getUniformLocation(program, "u_time"),
    };

    // Cache the effect
    const effect = { program, attributes, uniforms };
    this.effectCache.set(fragmentShaderSource, effect);

    return effect;
  }

  /**
   * Compiles a shader of a given type from source.
   * @param {number} type - The type of shader (e.g., gl.VERTEX_SHADER).
   * @param {string} source - The GLSL source code.
   * @returns {WebGLShader} - The compiled shader.
   * @throws {Error} - If shader compilation fails.
   */
  _compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check compilation status
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const shaderType = type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT";
      const infoLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`${shaderType} shader compilation failed: ${infoLog}`);
    }

    return shader;
  }

  /**
   * Links vertex and fragment shaders into a shader program.
   * @param {WebGLShader} vertexShader - The compiled vertex shader.
   * @param {WebGLShader} fragmentShader - The compiled fragment shader.
   * @returns {WebGLProgram} - The linked shader program.
   * @throws {Error} - If program linking fails.
   */
  _linkProgram(vertexShader, fragmentShader) {
    const gl = this.gl;
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check linking status
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const infoLog = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Shader program linking failed: ${infoLog}`);
    }

    // Shaders can be deleted after linking
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  /**
   * Applies a shader effect to the source canvas and renders it onto the destination 2D context.
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement} sourceCanvas - The source image.
   * @param {CanvasRenderingContext2D} ctx - The destination 2D rendering context.
   * @param {string} effectSource - The GLSL fragment shader code for the effect.
   */
  applyEffect(sourceCanvas, ctx, effectSource) {
    const gl = this.gl;

    // Retrieve or create the shader program for the effect
    const effect = this.createEffect(effectSource);

    // Use the shader program
    gl.useProgram(effect.program);

    // Bind the VAO
    gl.bindVertexArray(this.vao);

    // Enable and set up vertex attributes
    if (effect.attributes.position >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.enableVertexAttribArray(effect.attributes.position);
      gl.vertexAttribPointer(
        effect.attributes.position,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    if (effect.attributes.texCoord >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.enableVertexAttribArray(effect.attributes.texCoord);
      gl.vertexAttribPointer(
        effect.attributes.texCoord,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    // Bind and update the texture with the source image
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      sourceCanvas
    );

    // Set uniform values
    gl.uniform1i(effect.uniforms.image, 0); // Texture unit 0
    gl.uniform1f(
      effect.uniforms.time,
      (performance.now() - this.startTime) / 1000.0
    );

    // Set viewport and clear
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the full-screen quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Unbind VAO and program
    gl.bindVertexArray(null);
    gl.useProgram(null);

    // Copy the result from WebGL canvas to 2D canvas
    ctx.drawImage(this.glCanvas, 0, 0);
  }

  /**
   * Updates the start time. Useful for resetting the time uniform.
   */
  resetTime() {
    this.startTime = performance.now();
  }

  /**
   * Cleans up all WebGL resources. Should be called when the EffectManager is no longer needed.
   */
  dispose() {
    const gl = this.gl;

    // Delete texture
    if (this.texture) {
      gl.deleteTexture(this.texture);
      this.texture = null;
    }

    // Delete buffers
    if (this.positionBuffer) {
      gl.deleteBuffer(this.positionBuffer);
      this.positionBuffer = null;
    }

    if (this.texCoordBuffer) {
      gl.deleteBuffer(this.texCoordBuffer);
      this.texCoordBuffer = null;
    }

    // Delete VAO
    if (this.vao) {
      gl.deleteVertexArray(this.vao);
      this.vao = null;
    }

    // Delete cached programs
    for (const effect of this.effectCache.values()) {
      if (effect.program) {
        gl.deleteProgram(effect.program);
      }
    }
    this.effectCache.clear();

    // Nullify WebGL context
    this.gl = null;
    this.glCanvas = null;
  }
}

// Shader Effects Definitions
export const effects = {
  grayscale: glsl`
    vec4 effect(sampler2D img, vec2 uv, float t) {
      vec4 color = texture(img, uv);
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      return vec4(vec3(gray), color.a);
    }
  `,

  retro: glsl`
    // Configuration constants
    const float COLOR_DISTORTION = 0.005;
    const float SCANLINE_INTENSITY = 0.01;
    const float SCANLINE_COUNT = 256.0;

    vec4 effect(sampler2D img, vec2 uv, float t) {
      // Apply color distortion
      vec4 texColor;
      texColor.r = texture(img, uv + vec2(COLOR_DISTORTION, 0.0)).r;
      texColor.g = texture(img, uv).g;
      texColor.b = texture(img, uv - vec2(COLOR_DISTORTION, 0.0)).b;
      texColor.a = texture(img, uv).a;

      // Apply scanline effect
      float scanline = sin(uv.y * SCANLINE_COUNT * 3.14159);
      texColor.rgb -= SCANLINE_INTENSITY * scanline;

      return texColor;
    }
  `,

  boxBlur: glsl`
    const float BLUR_RADIUS = 1.0;

    vec4 effect(sampler2D img, vec2 uv, float t) {
      vec2 texelSize = 1.0 / vec2(textureSize(img, 0));
      vec4 result = vec4(0.0);

      for (float x = -BLUR_RADIUS; x <= BLUR_RADIUS; x++) {
        for (float y = -BLUR_RADIUS; y <= BLUR_RADIUS; y++) {
          vec2 offset = vec2(x, y) * texelSize;
          result += texture(img, uv + offset);
        }
      }

      return result / ((2.0 * BLUR_RADIUS + 1.0) * (2.0 * BLUR_RADIUS + 1.0));
    }
  `,
};
