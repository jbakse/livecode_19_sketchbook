#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
    float mix_value = fragCoord_N.x;
    mix_value -= .5;
    mix_value = abs(mix_value);
    mix_value *= 2.0;

    mix_value = pow(mix_value, 2.0);
 
 

    // gl_FragColor.a = 1.0;
    // gl_FragColor.rgb = vec3(mix_value);




    gl_FragColor = mix(
        vec4(1.0, 0.0, 0.0, 1.0), 
        vec4(0.0, 0.0, 0.0, 1.0), 
        1.0 - mix_value
    );
}
