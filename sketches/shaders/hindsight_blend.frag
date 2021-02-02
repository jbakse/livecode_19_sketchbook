void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.y /= iResolution.x / iResolution.y;
    
    vec2 A = vec2(-0.5, 0);
    vec2 B = vec2(0.5, 0);
    vec2 C = vec2(0, 0.5);
    
    vec3 blue = vec3(35.0, 122.0, 144.0) / 255.0;
    vec3 pink = vec3(255.0, 122.0, 114.0) / 255.0;
    vec3 black = vec3(10, 5, 0) / 255.0;
    
    float blend = distance(uv.xy, B) / distance(A, B);
    vec3 color = mix(pink, blue, blend);
    
    fragColor = vec4(color, 1.0);
}