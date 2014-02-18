/**
 * 3D picker vertex shader
 * This is really just a pass-through shader.
 */

attribute vec4 vertexPos;

uniform mat4 mvpTrans;

// pass-through shader.
void main(void) {
  gl_Position = mvpTrans * vertexPos;
}

