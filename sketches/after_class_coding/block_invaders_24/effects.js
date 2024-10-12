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
