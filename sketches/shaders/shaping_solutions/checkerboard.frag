precision highp float;

void main() {
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    
    float gradient = 1.0 - gl_FragCoord.y / 1200.0;
    float gray = 0.5;
    float mask = mod(x + y, 2.0);
    
    float g = mix(gray, gradient, mask);
    
    gl_FragColor = vec4(g, g, g, 1.0);
}
