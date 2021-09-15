precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    vec2 offset = vec2(
        rand(i),
        rand(i + 1.0)
    );
    
    float size = rand(i + 2.0) * 0.1 + 0.1;
    vec3 color = vec3(
        rand(i + 3.0),
        rand(i + 4.0),
        rand(i + 5.0)
    );
    float d = distance(vec2(0.5, 0.5), f + offset * 0.3);
    vec3 c = step(size, d) + color;
    gl_FragColor = vec4(c, 1.0); // vec4() can take a vec3 and float!
}
