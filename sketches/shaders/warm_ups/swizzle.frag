precision highp float;

void main() {
    vec4 color;
    color.r = 1.;
    color.g = 0.;
    color.b = 0.;
    color.a = 1.;

    color.rgba = color.bgra;

    gl_FragColor = color;
}
