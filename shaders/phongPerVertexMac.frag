precision mediump float;
precision highp int;

// Color, texture
uniform vec4 solidColor;
uniform sampler2D tex;
uniform bool useTex;

// Interpolated vertex attributes
varying vec2 texCoords;
varying vec4 iDiff;
varying vec4 iSpec;

void main(void) {
  // Get base color from texture.
  vec4 texColor;
  if(useTex) {
    texColor = texture2D(tex, texCoords);
  }
  else {
    texColor = solidColor;
  }
  float texAlpha = texColor.a;
  if(texAlpha == 0.0) {
    discard;
  }
  
  vec4 color = texColor*(iDiff) + iSpec;
  gl_FragColor = vec4(color.rgb, texAlpha);
}



