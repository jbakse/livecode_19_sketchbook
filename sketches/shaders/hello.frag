precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;


void main()
{
    // set up 0, 0 at center -.5 at top, square aspect
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x -= .5;
    uv.y -= .5;
    uv.x *= u_resolution.x / u_resolution.y;
	
    gl_FragColor = vec4(uv.x, uv.y, 0, 1);
}