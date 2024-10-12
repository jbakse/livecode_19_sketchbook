// module

// glsl template tag that does nothing but lets us tag shader strings
const glsl = (x) => x;

export const grayscaleEffect = glsl`
    vec4 effect(vec4 color, float t) {
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      return vec4(vec3(gray), color.a);
    }
  `;

export const retroEffect = glsl`
    // Configuration variables
    const float COLOR_DISTORTION = 0.005;
    const float SCANLINE_INTENSITY = 0.01;
    const float SCANLINE_COUNT = 256.0;

    vec4 effect(vec4 color, float t) {
      vec2 uv = v_texCoord;
      
      // Apply color distortion
      vec4 texColor = texture(u_image, uv);
      texColor.r = texture(u_image, uv + vec2(COLOR_DISTORTION, 0.0)).r;
      texColor.b = texture(u_image, uv - vec2(COLOR_DISTORTION, 0.0)).b;
      
      // Apply scanline effect
      float scanline = sin(uv.y * SCANLINE_COUNT * 3.14159);
      texColor.rgb -= SCANLINE_INTENSITY * scanline;
      
      return texColor;
    }
  `;

export const boxBlurEffect = glsl`
    const float BLUR_RADIUS = 1.0;

    vec4 effect(vec4 color, float t) {
      vec2 texelSize = 1.0 / vec2(textureSize(u_image, 0));
      vec4 result = vec4(0.0);
      
      for (float x = -BLUR_RADIUS; x <= BLUR_RADIUS; x++) {
        for (float y = -BLUR_RADIUS; y <= BLUR_RADIUS; y++) {
          vec2 offset = vec2(x, y) * texelSize;
          result += texture(u_image, v_texCoord + offset);
        }
      }
      
      return result / ((2.0 * BLUR_RADIUS + 1.0) * (2.0 * BLUR_RADIUS + 1.0));
    }
  `;

export function applyEffect(gl, sourceCanvas, glCanvas, ctx, frag, time) {
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
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);

  // Set the time uniform
  gl.uniform1f(timeLocation, time);

  // Render to the WebGL canvas
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Copy the result back to the 2D canvas
  ctx.drawImage(glCanvas, 0, 0);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}
