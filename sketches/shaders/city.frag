precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float random (float i) {
    return fract(sin(dot(vec2(i * .01, .123), vec2(12.9898,78.233))) * 43758.5453123);
}

float map(float v, float a, float b, float y, float z) {
    float n = (v - a) / (b - a);
    return n * (z - y) + y;
}


vec2 map(vec2 v, vec2 a, vec2 b, vec2 y, vec2 z) {
    vec2 n = (v - a) / (b - a);
    return n * (z - y) + y;
}

float floor_to(float v, float m) {
    return floor(v/m)*m;
}

float max(float a, float b, float c) {
    return max(max(a, b), c);
}

float grid_width = 50.0;

void main()
{	
    vec4 frag_coord = gl_FragCoord;
    
    // scroll
    frag_coord.x += u_time * 20.; 

    // horizontal grid
    float i = floor(frag_coord.x / grid_width);
    float f = fract(frag_coord.x / grid_width);
    
    // create some buildings
    float building_top = 100.0 + floor_to(random(i), .1) * 300.0;
    float building_mask = step(building_top, frag_coord.y);

    // create a building gradient
    // vec4 building_color = vec4(
    //     map(frag_coord.y, 0., u_resolution.y, 0.2, -0.5),
    //     map(frag_coord.y, 0., u_resolution.y, 0.2, -0.5),
    //     map(frag_coord.y, 0., u_resolution.y, 0.2, -0.5),
    //     1.);
    
    // building_color += random(floor(frag_coord.x/(grid_width * 3.0))) * .3;

    // create a sky gradient
    vec4 sky_color = vec4(
        0.,
        0.,
        map(frag_coord.y, 0., u_resolution.y, 1., 0.3),
        1.);



    // create windows
    vec2 window_i = floor(frag_coord.xy / vec2(grid_width / 5.0, 20.0));
    vec2 window_f = fract(frag_coord.xy / vec2(grid_width / 5.0, 20.0));
    float window_mask = random(window_i.x * 1002.0 + window_i.y);
    window_mask = step(.7, window_mask);
    window_mask *= step(.3, window_f.x);
    window_mask *= step(.5, window_f.y);
    window_mask *= step(.2, f)-step(.8, f);
    
    
    


    vec4 o = building_mask * sky_color;
    // o += (1.-building_mask) * building_color;
    o.rgb += (1. - building_mask) * window_mask * vec3(.9, .9, .7);


    o.a = 1.0;
    gl_FragColor = o;
}