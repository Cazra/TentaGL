attribute vec3 vertexNormal;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

uniform mat4 mvpTrans;
uniform mat3 normalTrans;

// pass-through shader.
void main(void) {
  texCoords = vertexTexCoords;
  gl_Position = mvpTrans * vertexPos;
  vec3 normal = normalTrans*vertexNormal;
}