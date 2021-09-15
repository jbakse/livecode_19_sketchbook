precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float saturate(float a) {
    return clamp(a, 0.0, 1.0);
}
void main()
{
    // set up 0, 0 at center -.5 at top, square aspect
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.x /= u_resolution.y / u_resolution.x;
    
    vec2 mouse_N = u_mouse / u_resolution;
    mouse_N.y /= u_resolution.x / u_resolution.y;
    
    // circle_1: 1.0 = yes, 0.0 = no
    float circle_1 = step(distance(coord_N, vec2(0.4, 0.5)), 0.2);
    // float circle_1 = smoothstep(.3,.2,distance(coord_N, vec2(0.4, 0.5)));
    
    // circle_2: 1.0 = yes, 0.0 = no
    float circle_2 = step(distance(coord_N, vec2(0.6, 0.5)), 0.2);
    // float circle_2 = smoothstep(0.3, 0.2, distance(coord_N, vec2(0.6, 0.5)));
    
    float g = 0.0;
    g = circle_1;
    g = circle_2;
    g = circle_1 + circle_2;
    // g = circle_1 - circle_2;
    // g = circle_1 * circle_2;
    // g = min(circle_1, circle_2);
    // g = max(circle_1, circle_2);
    
    // g = 1.0 - (circle_1 + circle_2);
    // g = 1.0 - (1.0 - circle_1 + 1.0 - circle_2);
    // g = circle_1 + (1.0 - circle_2);
    // g = (1.0 - circle_1) + (circle_2);
    
    // g = saturate(g);
    g *= 0.9;
    gl_FragColor = vec4(g, g, g, 1);
}