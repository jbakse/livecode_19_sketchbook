#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    gl_FragColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(1.0, 0.0, 1.0, 1.0), fragCoord_N.x);
}
