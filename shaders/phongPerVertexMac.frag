precision mediump float;
precision highp int;

uniform float opacity;

// fog
const int FOG_NONE = 0;
const int FOG_LINEAR = 1;
const int FOG_EXP = 2;
const int FOG_EXP2 = 3;
uniform vec4 fogColor;
uniform int fogEquation;
uniform float fogDensity;

// Color, texture
uniform vec4 solidColor;
uniform sampler2D tex;
uniform bool useTex;

// Interpolated vertex attributes
varying vec2 texCoords;
varying vec4 iDiff;
varying vec4 iSpec;

void main(void) {
  // Get base color from texture.
  vec4 texColor;
  if(useTex) {
    texColor = texture2D(tex, texCoords);
  }
  else {
    texColor = solidColor;
  }
  float texAlpha = texColor.a * opacity;
  if(texAlpha == 0.0) {
    discard;
  }
  
  vec4 color = texColor*(iDiff) + iSpec;
  
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
  
  gl_FragColor = vec4(color.rgb, texAlpha);
}



