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

/** Returns a simple Model for a single triangle. */
TentaGL.Model.Triangle = function(xyz1, xyz2, xyz3) {
  // Create the model and add its vertices.
  var model = new TentaGL.Model();
  
  var v1 = new TentaGL.Vertex(xyz1);
  var v2 = new TentaGL.Vertex(xyz2);
  var v3 = new TentaGL.Vertex(xyz3);
  
  model.addVertex(v1);
  model.addVertex(v2);
  model.addVertex(v3);
  
  // Compute and set the normal vectors of the vertices to be the surface 
  // normal of the face they form.
  var u = vec3.subtract([], xyz2, xyz1);
  var v = vec3.subtract([], xyz3, xyz1);
  
  var n = vec3.cross(vec3.create(), u, v);
  
  v1.normal(n);
  v2.normal(n);
  v3.normal(n);
  
  // Set the texture coordinates.
  v1.texST([0, 0]);
  v2.texST([1, 0]);
  v3.texST([1, 1]);
  
  // Create a face from the 3 vertices.
  model.addFace(0,1,2);
  
  return model;
};


