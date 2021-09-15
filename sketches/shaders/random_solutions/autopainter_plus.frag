precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

float circle(vec2 coord, vec2 loc, float radius, float blur) {
    return smoothstep(radius, radius + blur, distance(loc, coord));
    return 1.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float tick = floor(u_time);
    
    vec3 background_color = vec3(
        rand(tick + vec2(0.1, 0.0)),
        rand(tick + vec2(0.2, 0.0)),
        rand(tick + vec2(0.3, 0.0))
    );
    background_color = mix(background_color, vec3(0.3, 0.3, 0.3), 0.5);
    
    vec3 tint = vec3(
        rand(tick + vec2(0.4, 0.0)),
        rand(tick + vec2(0.5, 0.0)),
        rand(tick + vec2(0.6, 0.0))
    );
    
    vec3 background_color2 = mix(background_color, tint, 0.5);
    
    vec3 background_gradient = mix(background_color, background_color2, uv.y);
    
    vec3 foreground_color = vec3(
        rand(tick + vec2(0.1, 0.1)),
        rand(tick + vec2(0.2, 0.1)),
        rand(tick + vec2(0.3, 0.1))
    );
    
    vec2 location = vec2(
        rand(tick + vec2(0.1, 0.2)),
        rand(tick + vec2(0.2, 0.2))
    ) * u_resolution;
    
    float size = rand(tick + vec2(0.1, 0.3)) * 500.0 + 100.0;
    
    vec2 location2 = vec2(
        rand(tick + vec2(0.3, 0.2)),
        rand(tick + vec2(0.4, 0.2))
    ) * u_resolution;
    
    vec3 foreground_color2 = 1.0 - foreground_color;
    
    vec3 scene = background_gradient;
    scene = mix(foreground_color, scene, circle(gl_FragCoord.xy, location, size, 40.0) + 0.3);
    scene = mix(foreground_color2, scene, circle(gl_FragCoord.xy, location2, size, 40.0) + 0.3);
    
    gl_FragColor = vec4(scene, 1.0);
}
