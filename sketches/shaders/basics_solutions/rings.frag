precision highp float;

void main() {
    float d = distance(vec2(600.0, 600.0), gl_FragCoord.xy);
    float g = step(80.0, mod(d, 140.0));
    gl_FragColor = vec4(g, g, g, 1.0);
}
