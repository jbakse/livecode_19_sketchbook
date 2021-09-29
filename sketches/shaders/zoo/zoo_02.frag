#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 out_FragColor;

float circle(vec2 frag_coord, float radius) {
    return length(frag_coord) - radius;
}

vec2 featherData(vec2 frag_coord, float radius) {
    frag_coord *= vec2(2.0, 1.0);
    float dist = length(frag_coord) - radius;
    float a = acos(dot(vec2(0.0, 1.0), normalize(frag_coord)));
    dist = dist + abs(a) * 0.2;
    return vec2(dist, a);
    
}

vec4 featherColor(vec2 fd) {
    
    float _rayAngle = 0.1;
    float _rayThick = 0.02;
    float rayChange = fwidth(fd.y) * 0.5;
    float rayAngle = abs(fract(fd.y / _rayAngle + 0.5) - 0.5) * _rayAngle;
    
    float rays = smoothstep(_rayThick - rayChange, _rayThick + rayChange, rayAngle);
    float shape = step(fd.x, 0.0);
    float mask = rays * shape;
    
    vec4 c;
    c.rgb = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), abs(fd.x * 6.0));
    c.rgb = mix(c.rgb, vec3(0.0, 1.0, 0.0), pow(fd.y, 3.0));
    c.rgb *= mask;
    c.a = shape;
    
    return c;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x /= u_resolution.y / u_resolution.x;
    
    // uv += vec2(u_time * .1, 0.0);
    // uv.y *= .4;
    // vec2 polar = vec2(sin(uv.x * 3.14) * uv.y, cos(uv.x * 3.14) * uv.y);
    
    // uv = polar;
    // uv.x += u_time * 0.1;
    // uv.y += u_time * -0.2;
    
    vec4 fc1;
    vec4 fc2;
    
    {
        vec2 grid = vec2(0.25, 0.5);
        vec2 uvi = floor(uv / grid);
        vec2 uvf = fract((uv) / grid);
        
        vec2 feather_transform = uvf / vec2(9.0, 3.2) - vec2(1.0 / 18.0, 0.01);
        vec2 fd = featherData(feather_transform, 0.3);
        fc1 = featherColor(fd);
    }
    
    {
        uv += vec2(0.125, 0.25);
        
        vec2 grid = vec2(0.25, 0.5);
        vec2 uvi = floor(uv / grid);
        vec2 uvf = fract((uv) / grid);
        
        vec2 feather_transform = uvf / vec2(9.0, 3.2) - vec2(1.0 / 18.0, 0.01);
        vec2 fd = featherData(feather_transform, 0.3);
        fc2 = featherColor(fd);
    }
    
    vec4 fc;
    fc.rgb = mix(fc1.rgb, fc2.rgb, fc2.a);
    fc.a = 1.0;
    
    // float check = mod(uvi.x - uvi.y, 2.0);
    // fc.a += check;
    // c.b = uvf.x;
    out_FragColor = vec4(fc);
    
}
