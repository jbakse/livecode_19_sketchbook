#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec3 color = vec3(1.0, 1.0, 1.0);
    {
        float left = step(200.0, gl_FragCoord.x);
        float top = step(200.0, gl_FragCoord.y);
        float right = step(gl_FragCoord.x, 400.0);
        float bottom = step(gl_FragCoord.y, 400.0);
        float inRect = left * top * right * bottom;
        color = mix(color, vec3(0.0, 1.0, 0.0), inRect);
    }
    {
        float left = step(500.0, gl_FragCoord.x);
        float top = step(200.0, gl_FragCoord.y);
        float right = step(gl_FragCoord.x, 700.0);
        float bottom = step(gl_FragCoord.y, 400.0);
        float inRect = left * top * right * bottom;
        color = mix(color, vec3(1.0, 0.0, 1.0), inRect);
    }

    gl_FragColor = vec4(color, 1);
}
