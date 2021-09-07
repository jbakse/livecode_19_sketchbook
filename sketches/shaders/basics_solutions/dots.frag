precision highp float;

void main() {
    vec2 i = floor(gl_FragCoord.xy / vec2(450.0, 450.0)); // unused!
    vec2 f = fract(gl_FragCoord.xy / vec2(450.0, 450.0));
    float d = distance(vec2(0.5, 0.5), f);
    float g = step(0.49, d);
    gl_FragColor = vec4(g, g, g, 1.0);
}
