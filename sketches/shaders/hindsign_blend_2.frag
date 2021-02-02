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
    
    float k1 = 1.0;
    float k2 = 1.0;
    
    float dA = max(0.0, 1.0 - pow(distance(uv, A) * k1, k2));
    float dB = max(0.0, 1.0 - pow(distance(uv, B) * k1, k2));
    float dC = max(0.0, 1.0 - pow(distance(uv, C) * k1, k2));
    
    vec3 blue = vec3(35.0, 122.0, 144.0) / 255.0;
    vec3 pink = vec3(255.0, 122.0, 114.0) / 255.0;
    vec3 green = vec3(44.0, 162.0, 148.0) / 255.0;
    
    float ddA = max(0.0, (dA - dB - dC));
    float ddB = max(0.0, (dB - dA - dC));
    float ddC = max(0.0, (dC - dA - dB));
    
    vec3 color = vec3(0.0);
    color += blue * ddA;
    color += pink * ddB;
    color += green * ddC;
    
    fragColor = vec4(color, 1.0);
    // fragColor = vec4(vec3(ddA + 0.1), 1.0);
}
