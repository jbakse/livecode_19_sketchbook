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
    
    c.r = step(u_mouse.x, gl_FragCoord.x) * step(gl_FragCoord.x - 5.0, u_mouse.x);
    
    gl_FragColor = c;
}
