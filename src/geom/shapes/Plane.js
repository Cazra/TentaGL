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
 * Constructs a model for a rectangular plane with the specified width and 
 * height. The plane is created with its lower-left corner at the origin of its 
 * model space. Its width is in the direction of its x axis and its height 
 * is in the direction of its y axis.
 * @param {Number} w  The width of the plane.
 * @param {Number} h  The height of the plane.
 * @param {Boolean} flipY   If true, the upper-left corner will be at the 
 *      origin instead.
 */
TentaGL.Model.Plane = function(w, h, flipY) {
  var model = new TentaGL.Model();
  
  flipY = flipY || false;
  
  // compute surface normal vector.
  var u = vec3.fromValues(w, 0, 0);
  var v = vec3.fromValues(0, h, 0);
  var n = vec3.cross(vec3.create(), u, v);
  
  if(flipY) {
    // Create vertices
    var v0 = new TentaGL.Vertex(0, 0, 0);
    v0.setNormal(n[0], n[1], n[2]);
    v0.setTexST(0,0);
    model.addVertex(v0);
    
    var v1 = new TentaGL.Vertex(0, -h, 0);
    v1.setNormal(n[0], n[1], n[2]);
    v1.setTexST(0,1);
    model.addVertex(v1);
    
    var v2 = new TentaGL.Vertex(w, -h, 0);
    v2.setNormal(n[0], n[1], n[2]);
    v2.setTexST(1,1);
    model.addVertex(v2);
    
    var v3 = new TentaGL.Vertex(w, 0, 0);
    v3.setNormal(n[0], n[1], n[2]);
    v3.setTexST(1,0);
    model.addVertex(v3);
    
    
  }
  else {
    // Create vertices
    var v0 = new TentaGL.Vertex(0, 0, 0);
    v0.setNormal(n[0], n[1], n[2]);
    v0.setTexST(0,1);
    model.addVertex(v0);
    
    var v1 = new TentaGL.Vertex(w, 0, 0);
    v1.setNormal(n[0], n[1], n[2]);
    v1.setTexST(1,1);
    model.addVertex(v1);
    
    var v2 = new TentaGL.Vertex(w, h, 0);
    v2.setNormal(n[0], n[1], n[2]);
    v2.setTexST(1,0);
    model.addVertex(v2);
    
    var v3 = new TentaGL.Vertex(0, h, 0);
    v3.setNormal(n[0], n[1], n[2]);
    v3.setTexST(0,0);
    model.addVertex(v3);
  }
  
  // Create faces.
  model.addFaceQuad(0, 1, 2, 3);
  
  // Compute tangental vectors.
  model.computeVertexTangentals();
  
  return model;
};

