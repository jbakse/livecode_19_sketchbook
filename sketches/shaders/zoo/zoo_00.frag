#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 out_FragColor;

float circle(vec2 frag_coord, float radius) {
    return length(frag_coord) - radius;
}

vec2 feather(vec2 frag_coord, float radius) {
    frag_coord *= vec2(2.0, 1.0);
    float dist = length(frag_coord) - radius;
    float d = acos(dot(vec2(0.0, 1.0), normalize(frag_coord)));
    dist = dist + abs(d) * 0.2;
    return vec2(dist, d);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x /= u_resolution.y / u_resolution.x;
    
    uv.x += u_time * 0.1;
    uv.y += u_time * 0.2;
    vec2 grid = vec2(0.25, 0.5);
    uv.x += grid.x * 0.5 * floor(uv.y / grid.y);
    
    // uv += vec2(0.5);
    vec2 uvi = floor(uv / grid);
    vec2 uvf = fract((uv) / grid);
    
    vec2 feather_pos = uvf / vec2(6.0, 3.0) - vec2(1.0 / 12.0, 0.01);
    vec2 f = feather(feather_pos, 0.3);
    
    float lines = step(0.5, fract(f.x * 10.0));
    
    float rayChange = fwidth(f.y) * 0.5;
    float _rayDistance = 0.1;
    float _rayThick = 0.02;
    float rayDistance = abs(fract(f.y / _rayDistance + 0.5) - 0.5) * _rayDistance;
    float rays = smoothstep(_rayThick - rayChange, _rayThick + rayChange, rayDistance);
    float shape = step(f.x, 0.0);
    float mask = rays * shape;
    vec3 c = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), abs(f.x * 6.0));
    c = mix(c, vec3(0.0, 1.0, 0.0), pow(f.y, 3.0));
    c *= mask;
    
    float check = mod(uvi.x - uvi.y, 2.0);
    // c.r = check;
    // c.b = uvf.x;
    out_FragColor = vec4(c, 1.0);
    
}
