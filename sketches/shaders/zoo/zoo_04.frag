#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 out_FragColor;

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 p, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(
        cosine * p.x + sine * p.y,
        cosine * p.y - sine * p.x
    );
}

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

vec4 featherColor(vec2 fd, vec2 i) {
    
    float _rayAngle = 0.1;
    float _rayThick = 0.02;
    float rayChange = fwidth(fd.y) * 0.5;
    float rayAngle = abs(fract(fd.y / _rayAngle + 0.5) - 0.5) * _rayAngle;
    
    float rays = smoothstep(_rayThick - rayChange, _rayThick + rayChange, rayAngle);
    float shape = step(fd.x, 0.0);
    float mask = rays * shape;
    
    vec4 c;
    c.rgb = mix(vec3(random(i + 0.1) * 0.3 + 0.7, random(i + 0.2) * 0.3, random(i + 0.3) * 0.3), vec3(1.0, 1.0, 0.0) * (random(i + 0.04) * 0.5 + 0.5), abs(fd.x * 6.0));
    c.rgb = mix(c.rgb, vec3(0.0, 1.0, 0.0), pow(fd.y, 3.0));
    c.rgb *= mask;
    c.a = step(fd.x, 0.004);
    
    return c;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 screen_uv = uv;
    uv.x /= u_resolution.y / u_resolution.x;
    
    // uv += vec2(u_time * .1, 0.0);
    // uv.y *= .4;
    // vec2 polar = vec2(sin(uv.x * 3.14) * uv.y, cos(uv.x * 3.14) * uv.y);
    
    // uv = polar;
    uv.x += u_time * 0.01 + sin(u_time) * 0.04;
    uv.y += u_time * 0.1 + sin(u_time) * 0.05;
    uv *= 1.0 + sin(u_time * 0.2) * 0.2;
    
    vec4 fc1;
    vec4 fc2;
    
    float odd;
    
    {
        vec2 grid = vec2(0.25, 0.5);
        vec2 uvi = floor(uv / grid);
        vec2 uvf = fract((uv) / grid);
        
        vec2 feather_transform = uvf / vec2(9.0, 3.2) - vec2(1.0 / 18.0, 0.01);
        // feather_transform.x += random(uvi) * 0.02;
        // feather_transform.y += random(uvi + vec2(0.1, 0)) * 0.02;
        // feather_transform = rotate(feather_transform, (random(uvi) - 0.5) * 0.15);
        float a = sin(u_time + uvi.x);
        feather_transform = rotate(feather_transform, a * 0.05);
        vec2 fd = featherData(feather_transform, 0.28);
        fc1 = featherColor(fd, uvi);
        
        odd = mod(floor(uv.y / 0.25), 2.0);
    }
    
    {
        uv += vec2(0.125, 0.25);
        
        vec2 grid = vec2(0.25, 0.5);
        vec2 uvi = floor(uv / grid);
        vec2 uvf = fract((uv) / grid);
        
        vec2 feather_transform = uvf / vec2(9.0, 3.2) - vec2(1.0 / 18.0, 0.01);
        float a = sin(u_time + uvi.x);
        feather_transform = rotate(feather_transform, a * 0.05);
        vec2 fd = featherData(feather_transform, 0.28);
        fc2 = featherColor(fd, uvi);
    }
    
    vec4 fc;
    if (odd < 0.5) {
        fc.rgb = mix(fc1.rgb, fc2.rgb, fc2.a);
    } else {
        fc.rgb = mix(fc2.rgb, fc1.rgb, fc1.a);
    }
    
    fc.rgb *= 1.0 - pow(length(screen_uv - vec2(0.5)) * 1.5, 2.0) * 1.0;
    
    fc.a = 1.0;
    
    out_FragColor = vec4(fc);
    
}
