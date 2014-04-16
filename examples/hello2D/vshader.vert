attribute vec3 vertexPos;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;

// pass-through shader.
void main(void) {
  gl_Position = pMatrix * mvMatrix * vec4(vertexPos, 1.0);
}

