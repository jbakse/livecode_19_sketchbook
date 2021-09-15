precision highp float;

uniform float u_time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float r = rand(gl_FragCoord.xy * 0.001 + vec2(u_time * 0.001, 0.0));
    // float r = rand(gl_FragCoord.xy * 0.001 + u_time); // a lot of the groups came up with this, wich works pretty well but has some noticable artifacting
    gl_FragColor = vec4(r, 0.0, 0.0, 1.0);
}
