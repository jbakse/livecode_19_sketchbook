precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main()
{
    // set up 0, 0 at center -.5 at top, square aspect
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.x /= u_resolution.y / u_resolution.x;
    
    float gradient = coord_N.x;
    float circle = step(0.2, distance(coord_N, vec2(0.5, 0.5)));
    
    float g = 0.0;
    // just show the gradient
    g = gradient;
    
    // just show the circle
    g = circle;
    
    // white border, gradient circle
    g = max(circle, gradient);
    
    // gradient border, black circle
    g = min(circle, gradient);
    
    // gradient border, black circle
    g = circle * gradient;
    
    // invert (gradient border, black circle)
    g = 1.0 - (circle * gradient);
    
    // black border, gradient circle
    g = gradient * (1.0 - circle);
    
    gl_FragColor = vec4(g, g, g, 1);
}