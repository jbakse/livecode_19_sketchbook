void main() {
    highp float g = step(10.0, mod(gl_FragCoord.y, 100.0));
    gl_FragColor = vec4(g, g, g, 1.0);
}
