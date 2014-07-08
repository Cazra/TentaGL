precision mediump float;

uniform sampler2D tex;

varying vec2 texCoords;
varying vec3 vNormal;

void main(void) {
  vec4 color = texture2D(tex, texCoords); 
  if(color.a == 0.0) {
    discard;
  }
  gl_FragColor = color;
}