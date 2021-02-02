// example using 2D signed distance fields

// reference and code adapted from:
// https://www.ronja-tutorials.com/2018/11/10/2d-sdf-basics.html
// https://thebookofshaders.com/07/

precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

float map(float v, float a, float b, float y, float z) {
    float n = (v - a) / (b - a);
    return n * (z - y) + y;
}

float map(float v, float a, float b, float y, float z, bool c) {
    float n = (v - a) / (b - a);
    float o = n * (z - y) + y;
    return c ? clamp(o, y, z) : o;
}

vec2 map(vec2 v, vec2 a, vec2 b, vec2 y, vec2 z) {
    vec2 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec3 map(vec3 v, vec3 a, vec3 b, vec3 y, vec3 z) {
    vec3 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec4 map(vec4 v, vec4 a, vec4 b, vec4 y, vec4 z) {
    vec4 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec2 map(vec2 v, float a, float b, float y, float z) {
    vec2 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec3 map(vec3 v, float a, float b, float y, float z) {
    vec3 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

vec4 map(vec4 v, float a, float b, float y, float z) {
    vec4 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 random2d(vec2 st) {
    return vec2(random(st), random(st + vec2(1.0, 0.0)));
}

float circle(vec2 center, float radius) {
    return length(center) - radius;
}

vec2 translate(vec2 samplePosition, vec2 offset) {
    return samplePosition - offset;
}

float round_merge(float shape1, float shape2, float radius) {
    vec2 intersectionSpace = vec2(shape1 - radius, shape2 - radius);
    intersectionSpace = min(intersectionSpace, 0.0);
    float insideDistance = -length(intersectionSpace);
    float simpleUnion = min(shape1, shape2);
    float outsideDistance = max(simpleUnion, radius);
    return insideDistance + outsideDistance;
}

float randomCircle(vec2 uv, float seed) {
    float t = floor(u_time * 0.1);
    vec2 offset = random2d(vec2(seed, t));
    offset = map(offset, 0.0, 1.0, - 0.5, 0.5);
    vec2 circleLoc = translate(uv, offset);
    return circle(circleLoc, 0.2);
}

vec2 pingpong(vec2 v) {
    // return min(fract(v * .5), 1.-fract(v * .5)) * 2.;
    return min(mod(v, vec2(2.0)), 2.0 - mod(v, vec2(2.0)));
}

vec4 texture2Dpp(sampler2D t, vec2 uv) {
    return texture2D(t, pingpong(uv));
}

float lines(float d) {
    return 1.0 - smoothstep(0.02, 0.03, abs(fract(d * 10.0 + 0.5) - 0.5));
}

float zeroLine(float d) {
    return 1.0 - smoothstep(0.01, 0.012, abs(d));
}

vec4 cloud(vec2 uv) {
    
    vec2 cloud_uv = (uv * vec2(0.5, 1.0) + 1.0) * 0.5;
    vec4 t_cloud = texture2Dpp(u_tex1, cloud_uv + vec2(u_time * 0.01, 0.0));
    vec4 t_cloud_2 = texture2Dpp(u_tex1, cloud_uv + vec2(u_time * 0.04, 0.0));
    t_cloud *= t_cloud;
    t_cloud_2 *= t_cloud_2;
    return smoothstep(0.3, 0.5, vec4(t_cloud.r * t_cloud_2.g));
}

void main()
{
    
    // set up 0, 0 at center -.5 at top, square aspect
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x -= 0.5;
    uv.y -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // create islands
    float scene_d = randomCircle(uv, 0.0);
    for(float i = 1.0; i <= 10.0; i ++ ) {
        float d = randomCircle(uv, i);
        scene_d = round_merge(scene_d, d, 0.1);
    }
    
    // perturb islands
    vec4 t_noise_low = texture2D(u_tex1, map(uv * 0.1, - 1.0, 1.0, 0.0, 1.0));
    vec4 t_noise_high = texture2D(u_tex1, map(uv * 0.3, - 1.0, 1.0, 0.0, 1.0));
    scene_d += (t_noise_low.r - 0.5);
    scene_d -= (t_noise_high.r - 0.5);
    
    float waves = (sin(u_time * 1.0 + uv.x * 10.0) + 1.0) * 0.005;
    float center = 0.0;
    float width = 0.05;
    float sweet = smoothstep(width, 0.0 , abs(center - scene_d));
    
    scene_d += waves * sweet;
    
    // stroke elevations
    float zeroLine_n = zeroLine(scene_d);
    float lines_n = lines(scene_d);
    
    // visualize data
    // gl_FragColor = vec4(zeroLine_n, lines_n, scene_h, 1.0); return;
    
    // map to height
    
    vec4 t_warp = texture2Dpp(u_tex1, uv + vec2(u_time * 0.01, 0.0));
    vec4 t_warped_warp = texture2Dpp(u_tex1, uv + t_warp.xy);
    
    // lookup color
    float c_x = map(scene_d, - 0.3, 0.2, 0.0, 1.0, true);
    float warp_n = smoothstep(0.0, 0.01, scene_d);
    float wave = sin(u_time * 0.1 + uv.x * 5.0) * 0.5 + 0.5;
    vec4 c = texture2D(u_tex0, vec2(c_x, wave) + t_warped_warp.xy * 0.2 * warp_n);
    
    // c.r += sweet;
    gl_FragColor = c;
    
}