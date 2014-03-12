precision mediump float;

uniform sampler2D tex;
uniform vec4 color;

varying vec2 texCoords;

// All fragments are colored white.
void main(void) {
//  gl_FragColor = color;
  vec4 color = texture2D(tex, texCoords); 
  if(color.a == 0.0) {
    discard;
  }
  gl_FragColor = color;
}