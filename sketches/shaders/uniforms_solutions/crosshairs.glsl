precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    vec4 c = vec4(0.0, 0.0, 0.0, 1.0);
    
    // using if / &&
    // if (u_mouse.x > gl_FragCoord.x && u_mouse.x < gl_FragCoord.x + 5.0) c.r = 1.0;
    
    // using step / *
    // step is always 0 or 1.
    //
    //  * 0   1
    //  0 0   0
    //  1 0   1
    
    float vertical_bar = step(u_mouse.x, gl_FragCoord.x) * step(gl_FragCoord.x - 5.0, u_mouse.x);
    float horizontal_bar = step(u_mouse.y, gl_FragCoord.y) * step(gl_FragCoord.y - 5.0, u_mouse.y);
    
    c.rgb = vec3(max(horizontal_bar, vertical_bar));
    
    gl_FragColor = c;
}
