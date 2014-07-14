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
varying vec4 vView;

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
  float spotExp;
};

uniform int numLights;
uniform Light lights[MAX_LIGHTS];


/** Produces a color to represent a unit vector. (For debugging) */
vec4 vecToColor(in vec3 v) {
  vec3 unitVec = normalize(v);
  
  float x = (unitVec.x + 1.0)/2.0;
  float y = (unitVec.y + 1.0)/2.0;
  float z = (unitVec.z + 1.0)/2.0;
  
  return vec4(x, y, z, 1);
}


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
  vec3 eyeVecHat = normalize(-vView.xyz);
  
  // Compute illumination.
  vec3 iDiff = vec3(0,0,0);
  vec3 iSpec = vec3(0,0,0);
  vec3 iAmb = vec3(0,0,0);
  for(int i=0; i < MAX_LIGHTS; i++) {
    if(i == numLights) {
      break;
    }
    
    vec4 lDiff = lights[i].diff;
    vec4 lSpec = lights[i].spec;
    vec4 lAmb = lights[i].amb;
    
    // Get the light's vector in View-space.
    vec3 lightVec;
    if(lights[i].type == LIGHT_PT || lights[i].type == LIGHT_SPOT) {
      lightVec = vec3((vTrans * lights[i].pos) - vView);
    }
    else if(lights[i].type == LIGHT_DIR) {
      lightVec = vec3(vTrans * vec4(lights[i].dir, 0)) ;
    }
    else {
      lightVec = vec3(0,0,0);
    }
    vec3 lightVecHat = normalize(lightVec);
    float dist = length(lightVec);
    
    // The half-way vector used for specular lighting computation.
    vec3 halfVec = normalize(eyeVecHat + lightVecHat); 
    
    // Compute the illumination for each light component.
    float diffAmt = max(dot(lightVecHat, n), 0.0) * lights[i].diff.a * m.diff.a;
    diffAmt = clamp(diffAmt, 0.0, 1.0);
    
    float specAmt = pow( max(dot(halfVec, n), 0.0), m.shininess) * lights[i].spec.a * m.spec.a;
    specAmt = clamp(specAmt, 0.0, 1.0);
    
    float ambAmt = m.amb.a * lights[i].amb.a;
    
    // Compute attenuation and spot-light effect
    float atten = 1.0;
    if(lights[i].type == LIGHT_PT || lights[i].type == LIGHT_SPOT) {
      atten = lights[i].attenA + lights[i].attenB*dist + lights[i].attenC*dist*dist;
    }
    if(lights[i].type == LIGHT_SPOT) {
      vec3 spotDirHat = normalize(vec3(vTrans * vec4(lights[i].dir, 0)));
      float spotEffect = pow(dot(lightVecHat, spotDirHat), lights[i].spotExp);
      atten *= spotEffect;
    }
    
    //illumination += vec3((diffAmt*(m.diff*lDiff) + specAmt*(m.spec*lSpec))/atten + ambAmt * (m.amb*lAmb));
    iDiff += diffAmt*(m.diff.rgb*lDiff.rgb)/atten;
    iSpec += specAmt*(m.spec.rgb*lSpec.rgb)/atten;
    iAmb += ambAmt*(m.amb.rgb*lAmb.rgb);
  }
  
  // Add emission lighting.
  vec3 iEmis = m.emis.a*m.emis.rgb;
  
  //vec3 color = texColor.rgb*illumination + m.emis.a*m.emis.rgb;
  vec3 color = texColor.rgb*iDiff + iSpec + iAmb + iEmis;
  float r = clamp(color.r, 0.0, 1.0);
  float g = clamp(color.g, 0.0, 1.0);
  float b = clamp(color.b, 0.0, 1.0);
  gl_FragColor = vec4(r, g, b, texAlpha);
  
  
  
  
  // DEBUG
  
}



