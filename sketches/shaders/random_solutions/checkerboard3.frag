precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    i.y = 0.0;
    vec3 color = vec3(
        rand(i + 0.1)
    );
    
    gl_FragColor = vec4(color, 1.0);
}
