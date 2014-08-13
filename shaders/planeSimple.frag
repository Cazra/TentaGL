precision mediump float;

uniform float opacity;

uniform vec4 solidColor;
uniform sampler2D tex;
uniform bool useTex;

uniform vec4 sFunc;
uniform vec4 tFunc;

// TODO: uniforms for coefficients defining the mapping of world coordinates to texture coordinates.

varying vec3 vNormal;

// It is impossible to keep texture coordinates for an infinite plane. 
// Therefore, we will compute the texture coordinates as a function of our world coordinates.
varying vec3 worldCoords;

void main(void) {
  vec4 color;
  
//  float s = fract(worldCoords.x/10.0);
//  float t = fract(worldCoords.z/10.0);
  float s = fract(worldCoords.x*sFunc.x + worldCoords.y*sFunc.y + worldCoords.z*sFunc.z + sFunc.w);
  float t = fract(worldCoords.x*tFunc.x + worldCoords.y*tFunc.y + worldCoords.z*tFunc.z + tFunc.w);
  
  if(useTex) {
    color = texture2D(tex, vec2(s, t)); 
  }
  else {
    color = solidColor;
  }
  
  float alpha = color.a * opacity;
  
  if(alpha == 0.0) {
    discard;
  }
  gl_FragColor = vec4(color.rgb, alpha);
}