precision mediump float;
precision highp int;

const int MAX_LIGHTS = 16;
const int LIGHT_AMB = 0;
const int LIGHT_PT = 1;
const int LIGHT_DIR = 2;
const int LIGHT_SPOT = 3;

// Material light properties
uniform vec4 matDiff;
uniform vec4 matSpec;
uniform vec4 matAmb;
uniform vec4 matEmis;
uniform float shininess;

// Texture and bump map
uniform sampler2D tex;
uniform sampler2D bumpTex;
uniform bool useBumpTex;

// Interpolated vertex attributes
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


void main(void) {
  // Get base color from texture.
  vec4 color = texture2D(tex, texCoords); 
  if(color.a == 0.0) {
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
  
  // Apply diffuse and specular light to the color.
  for(int i=0; i < MAX_LIGHTS; i++) {
    if(i == numLights) {
      break;
    }
    vec3 lightVecHat = normalize(lightVec[i]);
    float lightDist = length(lightVec[i]);
    
    vec3 halfVec = normalize(eyeVecHat + lightVecHat); // The half-way vector
    
    float diffCoeff = max(dot(lightVecHat, vNormal)*lights[i].diff[3], 0.0);
    float specCoeff = pow(max(dot(halfVec, vNormal)*lights[i].spec[3], 0.0), shininess);
    
    if(lights[i].type == LIGHT_PT || lights[i].type == LIGHT_SPOT) {
      diffCoeff /= lights[i].attenA + lights[i].attenB*lightDist + lights[i].attenC*lightDist*lightDist;
    }
    
    vec3 diff = diffCoeff * matDiff.a * lights[i].diff.a * (matDiff*lights[i].diff).rgb;
    vec3 spec = specCoeff * matSpec.a * lights[i].spec.a * (matSpec*lights[i].diff).rgb;
    vec3 amb = matAmb.a * lights[i].amb.a * (matAmb*lights[i].amb).rgb ;
    
    color *= vec4(diff, 1.0);
    color += vec4(spec, 0.0);
    color += vec4(amb, 0.0);
  }
  
  // Add emission lighting.
  color += vec4(matEmis.rgb*matEmis.a, 0.0);
  gl_FragColor = color;
}
