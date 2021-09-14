precision highp float;

void main() {
    float y = gl_FragCoord.y;
    y += sin(gl_FragCoord.x / 80.0) * 60.0;
    y += sin(gl_FragCoord.x / 10.0) * 10.0;
    //y += 10.0;
    float g = step(25.0, mod(y, 50.0));
    gl_FragColor = vec4(g, g, g, 1.0);
}
