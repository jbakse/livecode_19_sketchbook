precision mediump float;

float checkerboard() {
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    float mask = mod(x + y, 2.0);
    
    float light = 1.0 - gl_FragCoord.y / 1200.0;
    float dark = 0.5 - gl_FragCoord.y / 1200.0;
    
    float g = mix(dark, light, mask);
    
    return g;
}

float sticker() {
    
    float foreground = gl_FragCoord.x / 600.0 + (gl_FragCoord.y - 300.0) / 200.0;
    foreground = 1.0 - abs(foreground - 0.5) * 2.0;
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 4.0);
    
    return foreground;
}

void main()
{
    
    float checker_color = checkerboard();
    float sticker_color = sticker();
    
    float d = distance(vec2(300.0, 300.0), gl_FragCoord.xy);
    
    float g = mix(checker_color, sticker_color, step(200.0, d));
    
    gl_FragColor = vec4(g, g, g, 1.0);
    
}

