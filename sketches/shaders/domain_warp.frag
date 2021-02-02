precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;


float map(float v, float a, float b, float y, float z) {
    float n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec2 map(vec2 v, vec2 a, vec2 b, vec2 y, vec2 z) {
    vec2 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec2 pingpong(vec2 v) {
    // return min(fract(v * .5), 1.-fract(v * .5)) * 2.;
    return min(mod(v, vec2(2.)), 2.-mod(v, vec2(2.)));
}

vec4 texture2Dpp(sampler2D t, vec2 uv){
    return texture2D(t, pingpong(uv));
}

void main()
{
    vec2 uv = map(gl_FragCoord.xy, vec2(0.), u_resolution, vec2(0.), vec2(1.));
    vec4 t_noise = texture2Dpp(u_tex1, uv + vec2(0, u_time * .1));
    t_noise.y = texture2Dpp(u_tex1, uv.yx + vec2(0, u_time * .1)).r;
    t_noise = texture2Dpp(u_tex1, uv + t_noise.xy * .3);
    vec4 t_color = texture2Dpp(u_tex0, uv + t_noise.xy * .3);
    gl_FragColor = t_color;
}