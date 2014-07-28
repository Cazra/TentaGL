precision mediump float;

uniform vec2 p;
uniform vec2 u;

// The array of colors for each break point in the gradient.
uniform vec4 colors[16]; 

// The parametric break points for the gradient, including the start and 
// end break points (0 and 1). 
// The values in this array must be in ascending order.
uniform int breakPtCount;
uniform float breakPts[16]; 



varying vec2 texCoords;
varying vec3 vNormal;

void main(void) {
  
  if(length(u) == 0.0) {
    gl_FragColor = vec4(1,1,1,1);
    return;
  }
  
  vec2 v = texCoords - p;
  vec2 uHat = normalize(u);
  vec2 vHat = normalize(v);
  
  // Compute the projected parametric value for our gradient line.
  float s = (length(v)*dot(uHat, vHat))/length(u);
  
  int j = 0;
  
  for(int i=0; i < 15; i++) {
    j++;
    
    if(i == 0 && s < breakPts[0]) {
      gl_FragColor = colors[0];
      return;
    }
    else if(i == breakPtCount - 1) {
      gl_FragColor = colors[i];
      return;
    }
    else if(s >= breakPts[i] && s < breakPts[i + 1]) {
      vec4 c1 = colors[i];
      vec4 c2 = colors[i+1];
      
      float ds = breakPts[i+1] - breakPts[i];
      float alpha = (s-breakPts[i])/ds;
      
      gl_FragColor = colors[i]*(1.0-alpha) + colors[i+1]*alpha;
      return;
    }
  }
}