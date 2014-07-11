precision mediump float;
precision highp int;

const int MAX_LIGHTS = 16;
const int LIGHT_AMB = 0;
const int LIGHT_PT = 1;
const int LIGHT_DIR = 2;
const int LIGHT_SPOT = 3;

// Vertex attributes
attribute vec3 vertexNormal;
attribute vec3 vertexTang;
attribute vec2 vertexTexCoords;
attribute vec4 vertexPos;

// Transformed attributes
uniform mat4 mvpTrans;
uniform mat3 normalTrans;
uniform mat4 vpTrans; // Lights are always specified in world coordinates. So we only need the view-projection transform for them.

varying vec2 texCoords;
varying vec3 vNormal;
varying vec3 vTang;

// Lights
struct Light {
  int type;
  vec4 pos;
  vec3 dir;
  vec4 diff;
  vec4 spec;
  vec4 amb;
  float attenA;
  float attenB;
  float attenC;
  float cutOffAngle;
};

uniform int numLights;
uniform Light lights[MAX_LIGHTS];

varying vec3 lightVec[MAX_LIGHTS];
varying vec3 eyeVecHat;


/** 
 * This shader program does per-fragment Phong shading for multiple lights.
 * The shader supports ambient lights, point lights, directional lights, and
 * spot lights.
 */
void main(void) {
  texCoords = vertexTexCoords;
  gl_Position = mvpTrans * vertexPos;
  eyeVecHat = -normalize(gl_Position.xyz);
  
  vNormal = normalize(normalTrans*vertexNormal);
  vTang = normalize(normalTrans*vertexTang);
  
  // Compute light vectors.
  for(int i=0; i<MAX_LIGHTS; i++) {
    if(i == numLights) {
      break;
    }
    
    if(lights[i].type == LIGHT_DIR) {
      lightVec[i] = (vpTrans * vec4(lights[i].dir, 0.0)).xyz;
    }
    else {
      lightVec[i] = (vpTrans * lights[i].pos - gl_Position).xyz;
    }
  }
}
