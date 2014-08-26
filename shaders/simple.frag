precision mediump float;

uniform float opacity;

// fog
const int FOG_NONE = 0;
const int FOG_LINEAR = 1;
const int FOG_EXP = 2;
const int FOG_EXP2 = 3;
uniform vec4 fogColor;
uniform int fogEquation;
uniform float fogDensity;

uniform vec4 solidColor;
uniform sampler2D tex;
uniform bool useTex;

varying vec2 texCoords;
varying vec3 vNormal;

void main(void) {
  vec4 color;
  if(useTex) {
    color = texture2D(tex, texCoords); 
  }
  else {
    color = solidColor;
  }
  
  float alpha = color.a * opacity;
  
  if(alpha == 0.0) {
    discard;
  }
  
  // Use distance from eye to compute fog blending.
  if(fogEquation != FOG_NONE) {
    float z = gl_FragCoord.z/gl_FragCoord.w;
    
    float fogFactor;
    if(fogEquation == FOG_LINEAR) {
      fogFactor = (gl_DepthRange.far - z)/(gl_DepthRange.far - gl_DepthRange.near);
    }
    else if(fogEquation == FOG_EXP) {
      fogFactor = -(fogDensity*z);
      fogFactor = exp(fogFactor);
    }
    else if(fogEquation == FOG_EXP2) {
      fogFactor = pow(-(fogDensity*z), 2.0);
      fogFactor = exp(fogFactor);
    }
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    
    color = (1.0-fogFactor)*color + fogFactor*fogColor;
  }
  
  gl_FragColor = vec4(color.rgb, alpha);
}