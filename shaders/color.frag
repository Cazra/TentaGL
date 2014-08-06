precision mediump float;

uniform float opacity;
uniform vec4 color;

// Fragments are a solid color.
void main(void) {
  vec3 rgb = color.rgb;
  float a = color.a * opacity;
  
  if(a == 0.0) {
    discard;
  }
  
  gl_FragColor = vec4(rgb, a);
}