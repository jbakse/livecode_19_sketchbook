precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;
    
    coord_N.x += u_time * 0.5;
    float hill1 = sin(coord_N.x * 1.1) * 0.20;
    float hill2 = sin(coord_N.x * 15.0) * 0.05;
    float hill3 = sin(coord_N.x * 21.1) * 0.02;
    
    float hill_sum = hill1 + hill2 + hill3;
    
    vec3 sky = mix(vec3(0.7, 0.7, 1.0), vec3(0.0, 0.2, 1.0), coord_N.y);
    vec3 scene = mix(sky, vec3(0.0, 0.9, 0.0), step(coord_N.y, hill_sum));
    scene = mix(scene, vec3(0.0, 0.0, 0.0), step(coord_N.y, hill_sum) - step(coord_N.y, hill_sum - 0.01));
    
    gl_FragColor = vec4(scene, 1.0);
}
