// see: domain warping

precision highp float;

void main() {
    float x = floor(gl_FragCoord.x / 50.0);

    float wave_y = sin(gl_FragCoord.x / 100.0) * 30.0;
    float y = floor((gl_FragCoord.y + wave_y) / 30.0);
    float g = mod(x - y, 2.0);

    gl_FragColor = vec4(g, g, g, 1.0);
}
