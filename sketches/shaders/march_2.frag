precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

const int steps = 128;
float maxDist = 1.5;
float minDist = 0.5;
// !note

float sphere(vec3 pos, float rad) {
    return length(pos) - rad;
}
float smin(float a, float b, float k)
{
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k*h * (1.0 - h);
}

float scene(vec3 pos) {
    
    vec3 pos1 = pos;
    
    pos1.x += sin(pos1.y * 10.0 + u_time) * 0.1;
    pos1.x += sin(pos1.z * 10.0 + u_time) * 0.02;
    pos1.y += sin(pos1.z * 10.0 + u_time) * 0.01;
    pos1 = mod(pos1, 0.2) - 0.1;
    float s1 = sphere(pos1, 0.05);
    
    vec3 pos2 = pos;
    pos2.y += 0.1;
    pos2 = mod(pos2, 0.25) - 0.125;
    float s2 = sphere(pos2, 0.05);
    
    // return s2;
    return smin(s1, s2, 0.03);
    
}

float map(float v, float a, float b, float x, float y) {
    float n = (v - a) / (b - a);
    return x + n * (y - x);
}
vec3 estimateNormal(vec3 pos) {
    return normalize(
        vec3(
            scene(pos + vec3(0.001, 0.0, 0.0)) - scene(pos - vec3(0.001, 0.0, 0.0)),
            scene(pos + vec3(0.0, 0.001, 0.0)) - scene(pos - vec3(0.0, 0.001, 0.0)),
            scene(pos + vec3(0.0, 0.0, 0.001)) - scene(pos - vec3(0.0, 0.0, 0.001))
            
        )
    );
}

vec4 trace(vec3 camOrigin, vec3 dir) {
    vec3 ray = camOrigin;
    float totalDist = 0.0;
    
    totalDist += 1.0;
    ray += 1.0 * dir;
    
    for(int i = 0; i < steps; i ++ ) {
        float dist = scene(ray);
        float dist2 = scene(ray + vec3(0.0, 0.01, 0.0));
        vec3 n = estimateNormal(ray);
        if (dist < 0.001) {
            return vec4(
                vec3(dot(n, vec3(0.0, 0.0, 1.0)))
                + vec3(0.2, 0.2, 0.2)
                * map(totalDist, 1.0, 3.5, 1.0, 0.0),
                // (dist2 - dist) * 100.0,
                // map(totalDist, 0.5, 1.5, 1.0, 0.0),
                // map(totalDist, 0.5, 1.5, 1.0, 0.0),
            1.0);
        }
        totalDist += dist;
        ray += dist * dir;
    }
    
    return vec4(0.0, 0.0, 0.0, 1.0);
}

void pR(inout vec2 p, float a) {
    p = cos(a) * p + sin(a) * vec2(p.y, - p.x);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = (uv * 2.0) - vec2(1.0);
    
    vec3 camOrigin = vec3(0.0, 0.0, - 1.0);
    camOrigin.x += sin(u_time) * sin(u_time * 0.1) * 0.1;
    camOrigin.y += sin(u_time) * sin((u_time + 5.0) * 0.1) * 0.1;
    camOrigin.z += u_time * 0.1;
    vec3 rayOrigin = vec3(
        uv + camOrigin.xy,
        camOrigin.z + 1.0
    );
    
    vec3 dir = normalize(rayOrigin - camOrigin);
    
    pR(dir.xz, u_time * 0.1);
    pR(dir.yz, u_time * 0.1);
    
    vec4 color = trace(camOrigin, dir);
    
    gl_FragColor = color;
}