float random1f(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float map(float v, float a, float b, float c, float d) {
    float nv = (v - a) / (b - a);
    nv = pow(nv, 3.0);
    float o = nv * (d - c) + c;
    
    return o;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.y /= iResolution.x / iResolution.y;
    
    vec2 A = vec2(-0.5, 0);
    vec2 B = vec2(0.5, 0);
    vec2 C = vec2(0, 0.5);
    vec2 D = vec2(0.5, - 1.0);
    
    float k1 = 0.9; // size
    float k2 = 2.0; // shape
    
    // warp domains
    vec2 uvA = uv * vec2(1.0, 0.8);
    uvA.x += sin(uv.y * 5.0 + iTime) * 0.1;
    vec2 uvB = uv * vec2(0.8, 1.0);
    uvB.x += sin(uv.y * 4.0 + iTime) * 0.1;
    vec2 uvC = uv * vec2(1.0, 0.8);
    uvC.y += sin(uv.x * 4.0 + iTime) * 0.1;
    vec2 uvD = uv * vec2(0.2, 0.8);
    uvD.y += sin(uv.x * 4.0 + iTime) * 0.1;
    
    // create shaped gradient
    float dA = max(0.0, 1.0 - pow(distance(uvA, A) / k1, k2));
    float dB = max(0.0, 1.0 - pow(distance(uvB, B) / k1, k2));
    float dC = max(0.0, 1.0 - pow(distance(uvC, C) / k1, k2));
    float dD = max(0.0, 1.0 - pow(distance(uvD, D) / k1, k2));
    
    // smooth in, out
    dA = smoothstep(0.0, 1.0, dA);
    dB = smoothstep(0.0, 1.0, dB);
    dC = smoothstep(0.0, 1.0, dC);
    dD = smoothstep(0.0, 1.0, dD);
    
    // define colors
    vec3 blue = vec3(35.0, 122.0, 144.0) / 255.0;
    vec3 pink = vec3(255.0, 122.0, 114.0) / 255.0;
    vec3 green = vec3(44.0, 162.0, 148.0) / 255.0;
    vec3 black = vec3(20.0, 10.0, 0.0) / 255.0;
    
    vec3 vanta = vec3(-25, - 25, - 25) / 255.0;
    
    // lay in color blobs
    vec3 color = vec3(0.0);
    color = mix(color, blue, dA);
    color = mix(color, vanta, dC);
    color = mix(color, pink, dB);
    color = mix(color, green, dD);
    
    // add noise
    color += vec3(
        random1f(uv),
        random1f(uv + 1.0),
        random1f(uv + 2.0)
    ) * 0.1;
    
    // complex noise
    
    // float t = floor(iTime * 10.0);
    // float t_next = floor(iTime * 10.0 + 1.0);
    // float f = fract(iTime * 10.0);
    
    // vec3 noise = mix(
        //     vec3(
            //         random1f(uv + t),
            //         random1f(uv + t + 1.0),
            //         random1f(uv + t + 2.0)
        //     ),
        //     vec3(
            //         random1f(uv + t_next),
            //         random1f(uv + t_next + 1.0),
            //         random1f(uv + t_next + 2.0)
        //     ),
    // f);
    
    // color += noise * 0.1;
    
    fragColor = vec4(color, 1.0);
    // fragColor = vec4(vec3(ddA + 0.1), 1.0);
}
