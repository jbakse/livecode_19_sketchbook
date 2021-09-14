precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;
    
    vec2 original_coord_N = coord_N;
    
    coord_N.x += u_time * 2.0;
    float hill1 = sin(coord_N.x * 1.1) * 0.20;
    float hill2 = sin(coord_N.x * 15.0) * 0.05;
    float hill3 = sin(coord_N.x * 21.1) * 0.02;
    
    vec3 sky = mix(vec3(0.7, 0.7, 1.0), vec3(0.0, 0.2, 1.0), coord_N.y);
    
    float sun_df = distance(vec2(0.5, 0.3), original_coord_N);
    float sun_mask = step(sun_df, 0.2);
    vec3 sunny_sky = mix(sky, vec3(1.0, 1.0, 0.0), sun_mask);
    
    vec3 scene = mix(sunny_sky, vec3(0.0, 0.9, 0.0), step(coord_N.y, 0.3 + hill1 + hill2 + hill3));
    
    gl_FragColor = vec4(scene, 1.0);
}
