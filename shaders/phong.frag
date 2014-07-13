precision mediump float;
precision highp int;

const int MAX_LIGHTS = 16;
const int LIGHT_AMB = 1;
const int LIGHT_PT = 2;
const int LIGHT_DIR = 3;
const int LIGHT_SPOT = 4;

// View transform (for lights)
uniform mat4 vTrans;

// Material light properties
struct Material {
  vec4 diff;
  vec4 spec;
  vec4 amb;
  vec4 emis;
  float shininess;
};
uniform Material m;

// Texture and bump map
uniform sampler2D tex;
uniform sampler2D bumpTex;
uniform bool useBumpTex;

// Interpolated vertex attributes
varying vec2 texCoords;
varying vec3 vNormal;
varying vec3 vTang;
varying vec4 vWorld;

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


void main(void) {
  // Get base color from texture.
  vec4 texColor = texture2D(tex, texCoords); 
  float texAlpha = texColor.a;
  if(texAlpha == 0.0) {
    discard;
  }
  
  // Compute fragment normal vector.
  vec3 n = vNormal;
  if(useBumpTex) {
    vec3 binormal = cross(vNormal, vTang);
    mat3 bumpMat = mat3(vTang, binormal, vNormal);
    
    vec3 bumpColor = texture2D(bumpTex, texCoords).rgb;
    n = bumpMat * normalize(2.0 * bumpColor - 1.0);
  }
  
  // Computing the eye vector is easy, because in view space the eye is at (0,0,0).
  vec3 eyeVecHat = normalize((-vWorld).xyz);
  
  // Compute illumination.
  vec3 illumination = vec3(0,0,0);
  for(int i=0; i < MAX_LIGHTS; i++) {
    if(i == numLights) {
      break;
    }
    
    vec4 lDiff = lights[i].diff;
    vec4 lSpec = lights[i].spec;
    vec4 lAmb = lights[i].amb;
    
    // Get the light's vector in View-space.
    vec3 lightVec = vec3(vTrans * lights[i].pos);
    
    vec3 lightVecHat = normalize(lightVec);
    float lightDist = length(lightVec);
    
    vec3 halfVec = normalize(eyeVecHat + lightVecHat); // The half-way vector
    
    // Compute the illumination for each light component.
    float iDiff = max(dot(lightVecHat, vNormal), 0.0) * lights[i].diff.a * m.diff.a;
    iDiff = clamp(iDiff, 0.0, 1.0);
    
    if(lights[i].type == LIGHT_PT || lights[i].type == LIGHT_SPOT) {
      iDiff /= lights[i].attenA + lights[i].attenB*lightDist + lights[i].attenC*lightDist*lightDist;
    }
    
    float iSpec = pow( max(dot(halfVec, vNormal), 0.0), m.shininess) * lights[i].spec.a * m.spec.a;
    iSpec = clamp(iSpec, 0.0, 1.0);
    
    float iAmb = m.amb.a * lights[i].amb.a;
    
    illumination = vec3(iDiff * (m.diff*lDiff) + iSpec * (m.spec*lSpec) + iAmb * (m.amb*lAmb));
  }
  
  // Add emission lighting.
  vec3 color = texColor.rgb*illumination + m.emis.a*m.emis.rgb;
  gl_FragColor = vec4(color, texAlpha);
}
