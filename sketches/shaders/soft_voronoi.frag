// https://www.iquilezles.org/www/articles/smoothvoronoi/smoothvoronoi.htm

float random1f(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 random2f(vec2 st) {
    return vec2(
        fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123),
        fract(sin(dot(st.y + vec2(0.1, 0.2), vec2(12.9898, 78.233))) * 43758.5453123)
    );
}

float smoothVoronoi(in vec2 x)
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    
    float res = 0.0;
    for(float j =- 1.0; j <= 1.0; j ++ )
    for(float i =- 1.0; i <= 1.0; i ++ )
    {
        vec2 b = vec2(i, j);
        vec2 r = vec2(b) - f + random2f(p + b);
        float d = length(r);
        
        res += exp(-32.0 * d);
    }
    return - (1.0 / 32.0) * log(res);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // set up uv coords
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.y /= iResolution.x / iResolution.y;
    
    // position lights
    
    fragColor = vec4(vec3(smoothVoronoi(uv)), 1.0);
}