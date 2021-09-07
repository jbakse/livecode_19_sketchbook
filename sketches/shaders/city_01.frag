#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random(float i) {
    return fract(sin(dot(vec2(i * 0.01, 0.123), vec2(12.9898, 78.233))) * 43758.5453123);
}

vec4 sky() {
    return vec4(0.0, 0.0, .8, 1.0);
}
void main() {
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;

    vec4 color = sky();

    vec2 i = floor(gl_FragCoord.xy / 100.0);
    vec2 f = fract(gl_FragCoord.xy / 100.0);

    color.rgb = vec3(i.x * .1);

    float top = random(i.x) * 1.0;
    color.rgb = vec3(top);

    color.rgb = vec3(step(top, fragCoord_N.y));

    gl_FragColor = color;
}
