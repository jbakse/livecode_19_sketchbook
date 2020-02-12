// example using 2D signed distance fields

// reference and code adapted from: 
// https://www.ronja-tutorials.com/2018/11/10/2d-sdf-basics.html
// https://thebookofshaders.com/07/


precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 center, float radius) {
 return length(center) - radius;   
}


float rectangle(vec2 samplePosition, vec2 halfSize){
    vec2 componentWiseEdgeDistance = abs(samplePosition) - halfSize;
    float outsideDistance = length(max(componentWiseEdgeDistance, vec2(0,0)));
    float insideDistance = min(max(componentWiseEdgeDistance.x, componentWiseEdgeDistance.y), 0.0);
    return outsideDistance + insideDistance;
}

vec2 translate(vec2 samplePosition, vec2 offset){
    return samplePosition - offset;
}


float round_merge(float shape1, float shape2, float radius){
    vec2 intersectionSpace = vec2(shape1 - radius, shape2 - radius);
    intersectionSpace = min(intersectionSpace, 0.);
    float insideDistance = -length(intersectionSpace);
    float simpleUnion = min(shape1, shape2);
    float outsideDistance = max(simpleUnion, radius);
    return  insideDistance + outsideDistance;
}



void main()
{
    // set up 0, 0 at center -.5 at top, square aspect
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x -= .5;
    uv.y -= .5;
    uv.x *= u_resolution.x / u_resolution.y;
	


	// scene
    vec2 rectLoc = translate(uv, vec2(.2, .1));
    float d1 = rectangle(rectLoc, vec2(.2 + sin(u_time * .72) * .02));
    vec2 circleLoc = translate(uv, vec2(-.2, -.2));
    float d2 = circle(circleLoc, .2 + sin(u_time) * .02  );
    
    // merge them
    // float d = min(d1, d2);
    float d = round_merge( d1, d2, .2);
    
    
    // render it
    //  float r = smoothstep(-.02, .02, d);
    // float r = step(0., d);
    // float r = sin(d*120.0) * .5 + .5;

    vec4 col = mix(vec4(.2, .2, .2, 1.), vec4(.9, .9, .9, 1.), smoothstep(0., .005, d));


    float line_distance = .02;
    float line_thick = .003;
    float majorLineDistance = abs(fract((d + u_time * -.01) / line_distance + 0.5) - 0.5) * line_distance;
    float majorLines = smoothstep(0., line_thick, majorLineDistance);
    majorLines = mix(1., majorLines, smoothstep(0., .01, d));
    majorLines = mix(majorLines, 1., smoothstep(0.07, .09, d));
    
    col.rgb = col.rgb * vec3(majorLines);


    // float line_distance = .1;
    // float line_field = fract(d/line_distance);
    // float r = smoothstep(0., .1, line_field);
    // vec3 col = vec3(r, 0, 0);
    gl_FragColor = vec4(col);
}