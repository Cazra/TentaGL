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
  float cutOffAngleCos;
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


float getDiffuseAmt(in vec3 lightVecHat, in vec3 nHat, in Light light) {
  return max(dot(lightVecHat, nHat), 0.0) * light.diff.a * m.diff.a;
}


float getSpecularAmt(in vec3 lightVecHat, in vec3 nHat, in vec3 eyeVecHat, in Light light) {
  vec3 halfVec = normalize(eyeVecHat + lightVecHat);
  return pow(max(dot(halfVec, nHat), 0.0), m.shininess) * light.spec.a * m.spec.a;
}


float getAmbientAmt(in Light light) {
  return m.amb.a * light.amb.a;
}


float getAttenuation(in float dist, in Light light) {
  return 1.0/(light.attenA + light.attenB*dist + light.attenC*dist*dist);
}


void main(void) {
  // Get base color from texture.
  vec4 texColor = texture2D(tex, texCoords); 
  float texAlpha = texColor.a;
  if(texAlpha == 0.0) {
    discard;
  }
  
  // Compute fragment normal vector.
  vec3 nHat = normalize(vNormal);
  if(useBumpTex) {
    vec3 binormal = cross(vNormal, vTang);
    mat3 bumpMat = mat3(vTang, binormal, vNormal);
    
    vec3 bumpColor = texture2D(bumpTex, texCoords).rgb;
    nHat = bumpMat * normalize(2.0 * bumpColor - 1.0);
  }
  
  // Computing the eye vector is easy, because in view space the eye is at (0,0,0).
  vec3 eyeVecHat = normalize(-vView.xyz);
  
  // Compute illumination.
  vec4 iDiff = vec4(0,0,0,0);
  vec4 iSpec = vec4(0,0,0,0);
  vec4 iAmb = vec4(0,0,0,0);
  for(int i=0; i < MAX_LIGHTS; i++) {
    if(i == numLights) {
      break;
    }
    
    float diffAmt, specAmt, ambAmt;
    if(lights[i].type == LIGHT_AMB) {
      float ambAmt = m.amb.a * lights[i].amb.a;
      iAmb += ambAmt*(m.amb*lights[i].amb);
    }
    else if(lights[i].type == LIGHT_PT) {
      // Get the light's vector in View-space.
      vec3 lightVec = ((vTrans * lights[i].pos) - vView).xyz;
      vec3 lightVecHat = normalize(lightVec);
      float dist = length(lightVec);
      
      // Compute the illumination for each light component.
      diffAmt = getDiffuseAmt(lightVecHat, nHat, lights[i]);
      specAmt = getSpecularAmt(lightVecHat, nHat, eyeVecHat, lights[i]);
      ambAmt = getAmbientAmt(lights[i]);
      
      // Attenuate with distance.
      float atten = getAttenuation(dist, lights[i]);
      diffAmt *= atten;
      specAmt *= atten;
      ambAmt *= atten;
    }
    else if(lights[i].type == LIGHT_DIR) {
      // Get the light's vector in View-space.
      vec3 lightVec = (vTrans * vec4(lights[i].dir, 0)).xyz;
      vec3 lightVecHat = normalize(lightVec);
      
      // Compute the illumination for each light component.
      diffAmt = getDiffuseAmt(lightVecHat, nHat, lights[i]);
      specAmt = getSpecularAmt(lightVecHat, nHat, eyeVecHat, lights[i]);
      ambAmt = getAmbientAmt(lights[i]);
    }
    else if(lights[i].type == LIGHT_SPOT) {
      // Get the light's vector in View-space.
      vec3 lightVec = ((vTrans * lights[i].pos) - vView).xyz;
      vec3 lightVecHat = normalize(lightVec);
      float dist = length(lightVec);
      
      // Compute the illumination for each light component.
      diffAmt = getDiffuseAmt(lightVecHat, nHat, lights[i]);
      specAmt = getSpecularAmt(lightVecHat, nHat, eyeVecHat, lights[i]);
      ambAmt = getAmbientAmt(lights[i]);
      
      // Attenuate with distance and by proximity to the spotlight cone's edge.
      float atten = getAttenuation(dist, lights[i]);
      float spotEffect = 0.0;
      if(diffAmt > 0.0) {
        vec3 spotDirHat = normalize((vTrans * vec4(lights[i].dir, 0)).xyz);
        spotEffect = dot(lightVecHat, -spotDirHat);
        if(spotEffect >= lights[i].cutOffAngleCos) {
          spotEffect = pow(spotEffect, lights[i].spotExp);
        }
        else {
          spotEffect = 0.0;
        }
      }
      
      
      diffAmt *= atten*spotEffect;
      specAmt *= atten*spotEffect;
      ambAmt *= atten;
    }
    
    iDiff += diffAmt*(m.diff*lights[i].diff);
    iSpec += specAmt*(m.spec*lights[i].spec);
    iAmb += ambAmt*(m.amb*lights[i].amb);
  }
  
  vec4 color = texColor*iDiff + iSpec + iAmb + m.emis.a*m.emis;
  gl_FragColor = vec4(color.rgb, texAlpha);
}



