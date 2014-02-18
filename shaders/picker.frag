/**
 * 3D picker fragment shader.
 * All pixels are assigned their object's ID as their color.
 */
 
precision mediump float;

uniform vec4 objID;

void main(void) {
  gl_FragColor = objID; 
}
