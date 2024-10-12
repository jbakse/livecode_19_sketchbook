// module

import { Controls } from "./controls.js";
import { Graphics } from "./graphics.js";

const controls = new Controls();
const graphics = new Graphics(256, 256);
const images = {};

const grayscaleEffect = `
    vec4 effect(vec4 color) {
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      return vec4(vec3(gray), color.a);
    }
  `;
const glsl = (x) => x;
const retroEffect = glsl`
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

const boxBlurEffect = glsl`
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

function onFrame(t) {
  step();
  draw();

  window.requestAnimationFrame(onFrame);
}

await preload();
setup();
onFrame();

async function preload() {
  images.test_pattern = await graphics.loadImage(
    sketch_directory + "images/test_pattern.png"
  );
}

function setup() {}

function step() {}

function draw() {
  const t = performance.now() / 1000;
  graphics.background(100);
  graphics.image(images.test_pattern, [10 + Math.sin(t) * 20, 10], {
    tint: "red",
  });
  graphics.image(images.test_pattern, [80, 10], { tint: "blue" });
  graphics.image(images.test_pattern, [150, 10]); // No tint

  graphics.image(images.test_pattern, [100, 100, 128, 128]);
  // Apply the box blur effect
  // graphics.effect(boxBlurEffect, t);
  // Optionally, you can apply both effects in sequence:
  // graphics.effect(boxBlurEffect, t);
  // graphics.effect(retroEffect, t);
}
