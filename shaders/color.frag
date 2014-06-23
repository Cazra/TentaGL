precision mediump float;

uniform vec4 color;

// Fragments are a solid color.
void main(void) {
  gl_FragColor = color;
}