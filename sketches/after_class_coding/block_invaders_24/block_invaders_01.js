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

const retroEffect = `
    vec4 effect(vec4 color) {
      vec2 uv = v_texCoord;
      
      // Apply curvature
      vec2 curved_uv = uv * 2.0 - 1.0;
      curved_uv *= 1.1;  
      curved_uv = (curved_uv * 0.5 + 0.5) * 0.92 + 0.04;
      
      // Check if we're outside the curved area
      if (curved_uv.x < 0.0 || curved_uv.x > 1.0 || curved_uv.y < 0.0 || curved_uv.y > 1.0) {
        return vec4(0.0, 0.0, 0.0, 1.0);
      }
      
      // Sample the texture with the curved coordinates
      vec4 texColor = texture(u_image, curved_uv);
      
      // Apply scanlines
      float scanline = sin(curved_uv.y * 800.0) * 0.04;
      texColor -= scanline;
      
      // Apply color distortion
      texColor.r = texture(u_image, curved_uv + vec2(0.001, 0.0)).r;
      texColor.b = texture(u_image, curved_uv - vec2(0.001, 0.0)).b;
      
      // Apply vignette
      float vignette = curved_uv.x * curved_uv.y * (1.0 - curved_uv.x) * (1.0 - curved_uv.y);
      vignette = pow(vignette, 0.25);
      texColor *= vignette;
      
      return texColor;
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

  // Apply a simple grayscale effect
  graphics.effect(retroEffect);
}
