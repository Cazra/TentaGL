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
 * Constructs a model for a cylinder of a specified height and radius. 
 * The bottom center point of the cylinder is at the origin of its model space.
 * @param {Number} r        The radius of the cylinder.
 * @param {Number} h        The height of the cylinder.
 * @param {Number} lonInc   Optional. The angle increment for the longitude, 
 *      in radians. Default to TentaGL.TAU/20.
 * @return {TentaGL.Model}
 */
TentaGL.Model.Cylinder = function(r, h, lonInc) {
  var model = new TentaGL.Model(false, TentaGL.GL_BACK);
  
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
    var s = lon/TentaGL.TAU;
    
    var v = new TentaGL.Vertex(x, 0, z);
    v.setNormal(0, -1, 0);
    v.setTexST(s, 0);
    model.addVertex(v);
  }
  
  // In-between vertices
  for(var i=0; i < numLonVerts; i++) {
    var lon = i*lonInc;
  
    var xyz = TentaGL.Math.toCartesian([r, lon, 0]);
    var x = xyz[0];
    var z = xyz[2];
    var s = lon/TentaGL.TAU;
    
    var v = new TentaGL.Vertex(x, 0, z);
    v.setNormal(x, 0, z);
    v.setTexST(s, 0);
    model.addVertex(v);
  }
  for(var i=0; i < numLonVerts; i++) {
    var lon = i*lonInc;
  
    var xyz = TentaGL.Math.toCartesian([r, lon, 0]);
    var x = xyz[0];
    var z = xyz[2];
    var s = lon/TentaGL.TAU;
    
    var v = new TentaGL.Vertex(x, h, z);
    v.setNormal(x, 0, z);
    v.setTexST(s, 1);
    model.addVertex(v);
  }
  
  // Top circle vertices
  for(var i=0; i < numLonVerts; i++) {
    var lon = i*lonInc;
  
    var xyz = TentaGL.Math.toCartesian([r, lon, 0]);
    var x = xyz[0];
    var z = xyz[2];
    var s = lon/TentaGL.TAU;
    
    var v = new TentaGL.Vertex(x, h, z);
    v.setNormal(0, 1, 0);
    v.setTexST(s, 1);
    model.addVertex(v);
  }
  
  
  // Create the faces.
  
  // Bottom circle faces
  for(var j=2; j < numLonVerts; j++) {
    var index1 = 0;
    var index2 = j-1;
    var index3 = j;
    
    model.addFace(index1, index3, index2);
  }
  
  // In-between faces
  for(var j=0; j < numLonVerts-1; j++) {
    var index1 = 1*numLonVerts + (j+0);
    var index2 = 1*numLonVerts + (j+1);
    var index3 = 2*numLonVerts + (j+1);
    var index4 = 2*numLonVerts + (j+0);
    
    model.addFaceQuad(index1, index2, index3, index4);
  }
  
  // Top faces
  for(var j=2; j < numLonVerts; j++) {
    var index1 = 3*numLonVerts;
    var index2 = 3*numLonVerts + j-1;
    var index3 = 3*numLonVerts + j;
    
    model.addFace(index1, index2, index3);
  }
  
  return model;
};

