precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate(vec2 p, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(
        cosine * p.x + sine * p.y,
        cosine * p.y - sine * p.x
    );
}

float rectangle(vec2 frag_coord, vec2 size) {
    vec2 componentDistance = abs(frag_coord) - size;
    float outside = length(max(componentDistance, 0.0));
    float inside = min(max(componentDistance.x, componentDistance.y), 0.0);
    return outside + inside;
}

float circle(vec2 frag_coord, float radius) {
    return length(frag_coord) - radius;
}

void main() {
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.x /= u_resolution.y / u_resolution.x;
    
    vec2 uv = coord_N;
    uv -= vec2(0.5);
    
    float sdf = 1000.0;
    sdf = min(sdf, circle(uv + vec2(-0.1, - 0.1), 0.05));
    sdf = min(sdf, circle(uv + vec2(0.1, 0.1), 0.07));
    
    float discs = step(0.0, sdf);
    float lines = step(0.2, fract(sdf * 30.0));
    float g = min(discs, lines);
    gl_FragColor = vec4(g, g, g, 1.0);
}
