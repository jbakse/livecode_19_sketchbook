#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float random(float i) {
    return fract(sin(dot(vec2(i * 0.01, 0.123), vec2(12.9898, 78.233))) * 43758.5453123);
}



void main() {
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    // gl_FragColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(1.0, 0.0, 1.0, 1.0), fragCoord_N.x);

    vec3 color = vec3(0.0, 0.0, .5);

    float building_id = floor(gl_FragCoord.x / 100.0);

    color.r = step(random(building_id), fragCoord_N.y);

    gl_FragColor = vec4(color, 1.);
}
