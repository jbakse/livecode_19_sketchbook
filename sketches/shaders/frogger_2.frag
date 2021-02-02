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
    
    float s1 = ground(pos + vec3(0.0, 0.0, 0.0));
    for(float x = -1.0; x < 2.0; x ++ ) {
        for(float z = -1.0; z < 2.0; z ++ ) {
            vec2 i = vec2(x, z);
            vec3 f = pos; // + vec3(x, 0.0, z);
            f.x += random(i) * 0.9 ;
            f.z += random(i + 1.0) * 0.9 ;
            f.xz += vec2(x, z);
            // f.x += iTime * mod(i.z, 2.0);
            // f.xz = mod(f.xz, 1.0) - 0.5;
            
            f.y -= 0.5;
            s1 = min(s1, sphere(f, 0.25));
            
        }
    }
    
    return s1;
}

vec3 estimateNormal(vec3 pos) {
    
    return normalize(
        vec3(
            scene(pos - vec3(0.001, 0.0, 0.0)) - scene(pos + vec3(0.001, 0.0, 0.0)),
            scene(pos - vec3(0.0, 0.001, 0.0)) - scene(pos + vec3(0.0, 0.001, 0.0)),
            scene(pos - vec3(0.0, 0.0, 0.001)) - scene(pos + vec3(0.0, 0.0, 0.001))
            
        )
    );
}

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

// https://www.iquilezles.org/www/articles/rmshadows/rmshadows.htm
// float improvedSoftShadow(in vec3 ro, in vec3 rd, float mint, float maxt, float k)
// {
    //     float res = 1.0;
    //     float ph = 1e20;
    //     for(float t = mint; t < maxt; )
    //     {
        //         float h = scene(ro + rd * t);
        //         if (h < 0.001)return 0.0;
        //         float y = h*h / (2.0 * ph);
        //         float d = sqrt(h * h-y * y);
        //         res = min(res, k * d / max(0.0, t - y));
        //         ph = h;
        //         t += clamp(h, 0.01, 1.0);
    //     }
    //     return res;
// }
vec3 lightOrigin = vec3(-1.0, - 1.0, 0.0);

vec3 shade(vec3 pos) {
    float falloff = 0.4;
    vec3 albedo = vec3(1.0);
    vec3 diffuseColor = vec3(1.0, 0.8, 0.6);
    vec3 ambientColor = vec3(0.1, 0.1, 0.2);
    
    vec3 nor = calcNormal(pos);
    vec3 lig = normalize(vec3(-0.6, 1.0, - 0.6));
    
    float dif =
    clamp(dot(nor, lig), 0.0, 1.0) *
    softshadow(pos, lig, 0.01, 3.0, 0.3);
    
    vec3 col = albedo * dif * diffuseColor;
    col += ambientColor;
    return col;
}

vec3 trace(vec3 rayOrigin, vec3 rayDir, out float t, out float h) {
    const int maxSteps = 256;
    const float mint = 0.1;
    const float maxt = 100.0;
    int steps = 0;
    
    for(t = mint; t < maxt; ) {
        vec3 pos = rayOrigin + rayDir * t;
        h = scene(pos);
        if (abs(h) < 0.001) {
            return shade(pos);
            //return vec3(0.0);
        }
        t += h; //clamp(h, 0.001, 1.0);
        
        steps ++ ;
        if (steps >= maxSteps)break;
        
    }
    return vec3(0.0);
    
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // set up uv coords
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.y /= iResolution.x / iResolution.y;
    
    // position camera
    vec3 camOrigin = vec3(0.0, 15.0, - 1.0);
    
    vec3 rayOrigin = vec3(camOrigin.xy + uv, camOrigin.z + 3.0);
    
    // camOrigin.x += random(rayOrigin.xy + 1.0 / steps) * 0.05;
    // camOrigin.y += random(rayOrigin.xy + 1.0 / steps + 1.0) * 0.05;
    
    vec3 dir = normalize(rayOrigin - camOrigin);
    // pR(dir.xz, 0.3); // yaw camera
    pR(dir.yz, - 1.5); // pitch camera down
    
    float dist;
    float h;
    vec3 color = trace(camOrigin, dir, dist, h);
    
    // fog
    // float fog = clamp(map(dist, 1.0, 9.0, 1.0, 0.0), 0.0, 1.0);
    // color = mix(vec3(0.0), color, fog);
    
    // debug
    vec3 computeColor = vec3(samplesTaken / 256.0);
    // vec3 distColor = vec3(dist * 0.1);
    color = mix(color, computeColor, step(0.0, uv.x));
    // color = mix(color, distColor, step(0.5, uv.x));
    // vec3 hColor = mix(vec3(0.5), vec3(1.0, 0.0, 0.0), step(h, 0.0));
    // color = mix(color, hColor, step(0.1, uv.x));
    
    // Output to screen
    fragColor = vec4(color, 1.0);
}