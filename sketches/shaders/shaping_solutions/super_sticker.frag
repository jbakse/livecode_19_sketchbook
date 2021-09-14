precision highp float;

float checkerboard(vec2 xy) {
    float x = floor(xy.x / 50.0);
    float y = floor(xy.y / 50.0);
    float mask = mod(x + y, 2.0);
    float light = 0.5 - xy.y / 1200.0;
    float dark = 0.8;
    float g = mix(dark, light, mask);
    return g;
}

float sticker(vec2 xy) {
    float foreground = xy.x / 100.0 + (xy.y - 400.0) / 50.0;
    foreground = abs(foreground - 0.5) * 2.0;
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 1.0);
    return foreground;
    
}

void main() {
    
    float background = checkerboard(gl_FragCoord.xy);
    float foreground = sticker(gl_FragCoord.xy);
    
    float d = distance(vec2(300.0, 300.0), gl_FragCoord.xy);
    float composite_g = 1.0 - mix(foreground, background, step(200.0, d));
    
    gl_FragColor = vec4(composite_g, composite_g, composite_g, 1.0);
}
