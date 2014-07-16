precision mediump float;

uniform sampler2D tex;
uniform bool useTex;

varying vec2 texCoords;
varying vec3 vNormal;

// All fragments are colored white.
void main(void) {
  vec4 tColor;
  if(useTex) {
    tColor = texture2D(tex, texCoords); // Just so we don't crash when we try to give the shader a texture. 
  }
  else {
    tColor = vec4(1,1,1,1);
  }
  
  if(tColor.a == 0.0) {
    discard;
  }
  else {
    gl_FragColor = vec4((vNormal[0]+1.0)/2.0, (vNormal[1]+1.0)/2.0, (vNormal[2]+1.0)/2.0, 1.0);
  }
}