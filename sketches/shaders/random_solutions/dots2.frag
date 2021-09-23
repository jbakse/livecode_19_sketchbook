precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    vec3 dot_1 = vec3(0.0);
    {
        vec2 offset = vec2(
            rand(i + 0.0),
            rand(i + 1.0)
        );
        float size = 0.2;
        vec3 color = vec3(0.0);
        float jitter = 0.3;
        float d = distance(vec2(0.5, 0.5), f + offset * jitter);
        dot_1 = step(size, d) + color;
    }
    
    vec2 slid_xy = gl_FragCoord.xy;
    slid_xy -= vec2(25.0);
    i = floor(slid_xy.xy / vec2(50.0, 50.0));
    f = fract(slid_xy.xy / vec2(50.0, 50.0));
    vec3 dot_2 = vec3(0.0);
    {
        vec2 offset = vec2(
            rand(i + 2.0),
            rand(i + 3.0)
        );
        float size = 0.2;
        vec3 color = vec3(0.0);
        float jitter = 0.3;
        float d = distance(vec2(0.5, 0.5), f + offset * jitter);
        dot_2 = step(size, d) + color;
    }
    
    vec3 c = dot_1 * dot_2;
    
    gl_FragColor = vec4(c, 1.0); // vec4() can take a vec3 and float!
}
