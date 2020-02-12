precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;



float random (vec2 st) {
    return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453123);
}





void main()
{
    // set up 0, 0 at center -.5 at top, square aspect
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x -= .5;
    uv.y -= .5;
    uv.x *= u_resolution.x / u_resolution.y;
	
    
    vec2 uv2 = uv * 10.0 + vec2( u_time * .3, 0.);
    vec3 bg = vec3(random(floor(uv2)));

    vec2 n = vec2(floor(uv.x*12.+u_time), 2.);
    vec3 buildings = vec3(step(random(n), uv.y + .5));

    gl_FragColor.rgb = bg * buildings;
    gl_FragColor.a = 1.;
}