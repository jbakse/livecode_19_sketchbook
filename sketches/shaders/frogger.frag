void pR(inout vec2 p, float a) {
    p = cos(a) * p + sin(a) * vec2(p.y, - p.x);
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sphere(vec3 pos, float radius) {
    return length(pos) - radius;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float map(float v, float a, float b, float x, float y) {
    float n = (v - a) / (b - a);
    return x + n * (y - x);
}

float ground(vec3 pos) {
    return pos.y;
}

float samplesTaken = 0.0;

float scene(vec3 pos) {
    samplesTaken += 1.0 ;
    
    float sdf = ground(pos + vec3(0.0, 0.1, 0.0));
    {
        vec3 p = pos;
        vec3 i = floor(pos / 0.2);
        p.x += iTime * (mod(i.z, 3.0) + 1.0) * 0.1;
        p.xz = mod(p.xz, 0.2) - 0.1;
        sdf = min(sdf, sphere(p, 0.08));
    }
    return sdf;
    // {
        //     vec3 f = pos;
        //     f.xz = mod(pos.xz, 0.3) - 0.15;
        //     f.x += sin(iTime + i.z * 6.2 * 0.1) * 0.01;
        //     f.z += cos(iTime + i.z * 6.2 * 0.1) * 0.01;
        //     f.y += 0.05;
        //     s1 = sphere(f, 0.01);
    // }
    
    // float g = ground(pos + vec3(0.0, 0.1, 0.0));
    
    // return smin(s1, g, 0.1);
}

vec3 calcNormal6(in vec3 p)// for function f(p)
{
    const float eps = 0.0001; // or some other value
    const vec2 h = vec2(eps, 0);
    return normalize(vec3(scene(p + h.xyy) - scene(p - h.xyy),
    scene(p + h.yxy) - scene(p - h.yxy),
    scene(p + h.yyx) - scene(p - h.yyx)));
}
// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal(in vec3 pos)
{
    vec2 e = vec2(1.0, - 1.0) * 0.5773 * 0.0005;
    return normalize(
        e.xyy * scene(pos + e.xyy) +
        e.yyx * scene(pos + e.yyx) +
        e.yxy * scene(pos + e.yxy) +
        e.xxx * scene(pos + e.xxx)
    );
}

float softshadow(in vec3 ro, in vec3 rd, float mint, float maxt, float w)
{
    float s = 1.0;
    for(float t = mint; t < maxt; )
    {
        float h = scene(ro + rd * t);
        s = min(s, 0.5 + 0.5 * h / (w * t));
        if (s < 0.0)break;
        t += clamp(h, 0.01, 1.0);
    }
    s = max(s, 0.0);
    return s * s*(3.0 - 2.0 * s); // smoothstep
}

vec3 shade(vec3 pos) {
    float falloff = 0.4;
    vec3 albedo = vec3(1.0);
    vec3 diffuseColor = vec3(1.0, 0.8, 0.6);
    vec3 ambientColor = vec3(0.1, 0.1, 0.2);
    
    vec3 nor = calcNormal(pos);
    return nor;
    vec3 lig = normalize(vec3(-0.6, 1.0, - 0.6));
    
    float dif =
    clamp(dot(nor, lig), 0.0, 1.0) *
    softshadow(pos, lig, 0.01, 3.0, 0.3);
    
    vec3 col = albedo * dif * diffuseColor;
    col += ambientColor;
    return col;
}

vec3 trace(vec3 rayOrigin, vec3 rayDir, out float t) {
    const int maxSteps = 256;
    const float mint = 0.1;
    const float maxt = 10.0;
    
    for(t = mint; t < maxt; ) {
        vec3 pos = rayOrigin + rayDir * t;
        float h = scene(pos);
        if (h < 0.0001) {
            return shade(pos);
        }
        t += clamp(h, 0.001, 10.0);
    }
    return vec3(0.0);
    
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // set up uv coords
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.y /= iResolution.x / iResolution.y;
    
    // position lights
    
    // position camera
    vec3 camOrigin = vec3(0.0, 0.5, - 3.0);
    
    vec3 color = vec3(0.0);
    vec3 rayOrigin = vec3(camOrigin.xy + uv, camOrigin.z + 3.0);
    vec3 dir = normalize(rayOrigin - camOrigin);
    // pR(dir.xz, 0.3); // yaw camera
    pR(dir.yz, - 0.2); // pitch camera down
    
    float dist;
    color = trace(camOrigin, dir, dist);
    
    float fog = clamp(map(dist, 1.0, 9.0, 1.0, 0.0), 0.0, 1.0);
    color = mix(vec3(0.0), color, fog);
    
    // create debug views
    vec3 computeDebug = vec3(samplesTaken / 56.0);
    vec3 distanceDebug = vec3(dist * 0.5);
    color = mix(color, computeDebug, step(0.0, uv.x));
    // color = mix(color, distanceDebug, step(0.0, uv.x));
    
    fragColor = vec4(color, 1.0);
}