precision highp float;

void main() {
    // first layer is sky
    float sky = 2.0 - gl_FragCoord.y / 600.0;
    float g = sky;
    
    // then the gray mountains which are always darker than sky so we can composite with min()
    float background_height = sin(gl_FragCoord.x / 100.0) * 60.0 + 100.0;
    float background_c = step(background_height, gl_FragCoord.y - 400.0) + 0.25;
    g = min(g, background_c);
    
    // then the black mountains which are always darker than everything else so we can compsite with min()
    float foreground_height = sin(gl_FragCoord.x / 200.0) * 100.0;
    float foreground_c = step(foreground_height, gl_FragCoord.y - 400.0);
    g = min(g, foreground_c);
    
    gl_FragColor = vec4(g, g, g, 1.0);
}
