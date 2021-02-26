
// https://thebookofshaders.com/11/
float rnd (vec2 st) {
    return fract(sin(dot(st.xy * .01,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = rnd(i);
    float b = rnd(i + vec2(1.0, 0.0));
    float c = rnd(i + vec2(0.0, 1.0));
    float d = rnd(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float food(vec2 st) {
 return noise((st/iResolution.xy)*17.0) + .1;
}
bool hot(vec2 st) {
    float freq = .2;
    float f = food(st);
    return rnd(st + vec2(iTime)) < freq * f;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    
            
    
	
    
    
    //float r = rnd(fragCoord *.01+ vec2(iTime, iTime));
    
    
    if (iFrame == 0){
        float r = rnd(fragCoord + vec2(0, iDate[3])) + rnd(fragCoord + vec2(0, 2));
       

        fragColor = vec4(r < .001, 0.0, 0.0, 1);
    }else{
        vec2 left = fragCoord+vec2(-1,0);
        vec2 right = fragCoord+vec2(1,0);
        vec2 above = fragCoord+vec2(0,-1);
        vec2 below = fragCoord+vec2(0,1);
        
        vec4 a = texture(iChannel0, fragCoord/iResolution.xy);
        vec4 b = vec4(0);
        
        
        float freq = .15;
        
        
        // hot neighbor?
        if (hot(left)) {
            b = texture(iChannel0, left/iResolution.xy);
        }
        if (hot(right)) {
            b = texture(iChannel0, right/iResolution.xy);
        }
        if (hot(above)) {
            b = texture(iChannel0, above/iResolution.xy);
        }
        if (hot(below)) {
            b = texture(iChannel0, below/iResolution.xy);
        }
        if (b.r == 1.0 && a.r == 0.0) {
            a.r = 1.0;
        } 
           
        // i'm hot?
        if (hot(fragCoord)) {   
           a.r -= .01;
        }
        
        //a.b = food(fragCoord);
        
        
        
        // vec4 right = texture(iChannel0,(fragCoord+vec2( 0, 1))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2( 0,-1))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2( 1,-1))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2( 1, 0))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2( 1, 1))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2(-1,-1))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2(-1, 0))/iResolution.xy);
             //texture(iChannel0,(fragCoord+vec2(-1, 1))/iResolution.xy);
             
       // float r = rnd(fragCoord *.01+ vec2(0, 1));
       // r += rnd(fragCoord *.01+ vec2(0, 2));
        
        
        fragColor = clamp(a, 0.0, 1.0);
    }
}