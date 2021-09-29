precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 frag_coord, float radius) {
    return length(frag_coord) - radius;
}

void main()
{
    float c1_sdf = circle(gl_FragCoord.xy - vec2(350.0, 350.0), 150.0);
    float c2_sdf = circle(gl_FragCoord.xy - vec2(650.0, 350.0), 200.0);
    
    float c_sdf = min(c1_sdf, c2_sdf);
    
    float circle_mask = 0.0;
    if (c_sdf < 0.0) {
        circle_mask = 1.0;
    }
    
    float lines = fract(c_sdf * 0.01);
    lines = step(0.8, lines);
    
    vec3 color = vec3(1.0 - lines);
    color *= 1.0 - circle_mask;
    
    gl_FragColor = vec4(color, 1.0);
}