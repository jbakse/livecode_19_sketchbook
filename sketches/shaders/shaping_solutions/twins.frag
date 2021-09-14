precision highp float;

void main() {
    float d1 = distance(vec2(300.0, 300.0), gl_FragCoord.xy);
    float g1 = smoothstep(150.0, 250.0, d1);
    
    float d2 = distance(vec2(600.0, 300.0), gl_FragCoord.xy);
    float g2 = smoothstep(150.0, 250.0, d2);
    
    // using min() matches the challenge
    float g = min(g1, g2);
    
    // using * is better looking
    // float g = g1 * g2;
    
    gl_FragColor = vec4(g, g, g, 1.0);
}
