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
 * Constructs a model for a sphere of a specified radius. The center of the
 * sphere is at the origin of its model space.
 * @param {Number} r        The radius of the sphere.
 * @param {Number} latInc   Optional. The angle increment for the latitude, 
 *      in radians. Default to TentaGL.TAU/20.
 * @param {Number} lonInc   Optional. The angle increment for the longitude, 
 *      in radians. Default to TentaGL.TAU/20.
 * @return {TentaGL.Model}
 */
TentaGL.Model.Sphere = function(r, latInc, lonInc) {
  var model = new TentaGL.Model();
  
  if(!latInc) {
    latInc = TentaGL.TAU/20;
  }
  if(!lonInc) {
    lonInc = TentaGL.TAU/20;
  }
  
  var numLatVerts = Math.floor(TentaGL.TAU/2/latInc) + 1;
  var numLonVerts = Math.floor(TentaGL.TAU/lonInc) + 1;
  
  // Create the vertices.
  for(var i=0; i < numLatVerts; i++) {
    var lat = i*latInc - TentaGL.TAU/4;
    
    for(var j=0; j < numLonVerts; j++) {
      var lon = j*lonInc;
    
      var xyz = TentaGL.Math.toCartesian([r, lon, lat]);
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var s = lon/TentaGL.TAU;
      var t = lat/(TentaGL.TAU/2) + 0.5;
      
      var v = new TentaGL.Vertex(x, y, z);
      v.setNormal(x, y, z);
      v.setTexST(s, t);
      model.addVertex(v);
    }
  }
  
  // Create the faces.
  for(var i=0; i < numLatVerts-1; i++) {
    for(var j=0; j < numLonVerts-1; j++) {
      var index1 = (i+0)*numLonVerts + (j+0);
      var index2 = (i+0)*numLonVerts + (j+1);
      var index3 = (i+1)*numLonVerts + (j+1);
      var index4 = (i+1)*numLonVerts + (j+0);
      
      model.addFaceQuad(index1, index2, index3, index4);
    }
  }
  
  return model;
};

