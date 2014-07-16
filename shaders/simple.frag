precision mediump float;

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
  
  if(color.a == 0.0) {
    discard;
  }
  gl_FragColor = color;
}