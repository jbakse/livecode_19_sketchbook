precision highp float;

void main() {
    float y = gl_FragCoord.y;
    y += sin(gl_FragCoord.x / 5.0) * 10.0;
    float y2 = gl_FragCoord.y;
    y2 += sin(gl_FragCoord.x / 100.0) * 100.0;
    float g = step(50.0, mod(y + y2, 150.0));
    gl_FragColor = vec4(g, g, g, 1.0);
}
