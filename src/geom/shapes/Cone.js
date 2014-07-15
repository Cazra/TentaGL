/* 
 @preserve Copyright (c) 2014 Stephen "Cazra" Lindberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/


/** 
 * A simple model for a cone. The center of its base is located at the origin.
 * @constructor
 * @param {number} r    The radius of the cone's base.
 * @param {number} h    The cone's height
 * @param {uint} lonInc   Optional. The angle increment for the longitude, 
 *      in radians. Default to TentaGL.TAU/20.
 */
TentaGL.Model.Cone = function(r, h, lonInc) {
  var model = new TentaGL.Model();
  
  if(!lonInc) {
    lonInc = TentaGL.TAU/20;
  }
  
  var numLonVerts = Math.floor(TentaGL.TAU/lonInc) + 1;
  
  // Create the bottom circle vertices.
  for(var i=0; i < numLonVerts; i++) {
    var lon = i*lonInc;
  
    var xyz = TentaGL.Math.toCartesian([r, lon, 0]);
    var x = xyz[0];
    var z = xyz[2];
    var s = (x/r+1)/2; //lon/TentaGL.TAU;
    var t = (z/r+1)/2;
    
    var v = new TentaGL.Vertex(x, 0, z);
    v.setNormal(0, -1, 0);
    v.setTexST(s, t);
    model.addVertex(v);
  }
  
  // Side vertices
  for(var i=0; i < numLonVerts; i++) {
    var lon1 = i*lonInc;
    var xyz1 = TentaGL.Math.toCartesian([r, lon1, 0]);
    var x1 = xyz1[0];
    var z1 = xyz1[2];
    
    var lon2 = (i+0.5)*lonInc;
    var xyz2 = TentaGL.Math.toCartesian([r, lon2, 0]);
    var x2 = xyz2[0];
    var z2 = xyz2[2];
    
    // Compute the normals for the side.
    var uVec1 = vec3.sub(vec3.create(), [0, h, 0], xyz1);
    var rVec1 = vec3.fromValues(x1, 0, z1);
    var vVec1 = vec3.cross(vec3.create(), rVec1, uVec1);
    var nVec1 = vec3.cross(vec3.create(), uVec1, vVec1);
    vec3.normalize(nVec1, nVec1);
    
    var uVec2 = vec3.sub(vec3.create(), [0, h, 0], xyz2);
    var rVec2 = vec3.fromValues(x2, 0, z2);
    var vVec2 = vec3.cross(vec3.create(), rVec2, uVec2);
    var nVec2 = vec3.cross(vec3.create(), uVec2, vVec2);
    vec3.normalize(nVec2, nVec2);
    
    // Create the vertices and add them to the model
    var vBase = new TentaGL.Vertex(x1, 0, z1);
    vBase.setTexST(lon1/TentaGL.TAU, 0);
    vBase.setNormal(nVec1[0], nVec1[1], nVec1[2]);
    
    var vTop = new TentaGL.Vertex(0, h, 0);
    vTop.setTexST(lon2/TentaGL.TAU, 1);
    vTop.setNormal(nVec2[0], nVec2[1], nVec2[2]);
    
    model.addVertex(vBase);
    model.addVertex(vTop);
  }
  
  // We need 1 more base vertex for everything to match up.
  var xyz1 = TentaGL.Math.toCartesian([r, 0, 0]);
  var x1 = xyz1[0];
  var z1 = xyz1[2];
  
  var uVec1 = vec3.sub(vec3.create(), [0, h, 0], xyz1);
  var rVec1 = vec3.fromValues(x1, 0, z1);
  var vVec1 = vec3.cross(vec3.create(), rVec1, uVec1);
  var nVec1 = vec3.cross(vec3.create(), uVec1, vVec1);
  vec3.normalize(nVec1, nVec1);
  
  var vBase = new TentaGL.Vertex(x1, 0, z1);
  vBase.setTexST(TentaGL.TAU, 0);
  vBase.setNormal(nVec1[0], nVec1[1], nVec1[2]);
  model.addVertex(vBase);
  
  // Bottom circle faces
  for(var j=2; j < numLonVerts; j++) {
    var index1 = 0;
    var index2 = j-1;
    var index3 = j;
    
    model.addFace(index1, index3, index2);
  }
  
  // Side faces
  for(var j=0; j < numLonVerts*2; j+=2) {
    var index1 = numLonVerts + (j+0);
    var index2 = numLonVerts + (j+2);
    var index3 = numLonVerts + (j+1);
    
    model.addFace(index1, index2, index3);
  }
  
  
  return model;
  
};


