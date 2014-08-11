precision mediump float;

uniform float opacity;

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
  float s = texCoords[0] - 0.5;
  float t = texCoords[1] - 0.5;
  
  if(alpha == 0.0 || s*s + t*t > 0.25) {
    discard;
  }
  
  gl_FragColor = vec4(color.rgb, alpha);
}