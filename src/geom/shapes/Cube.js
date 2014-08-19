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
 * Creates a cube model with the specified width, height, and depth. 
 * The cube's lower-left-back corner is located at the origin of its 
 * model space. 
 * @param {Number} w  The width of the cube.
 * @param {Number} h  The height of the cube.
 * @param {Number} d  The depth of the cube.
 */
TentaGL.Model.Cube = function(w, h, d) {
  var model = new TentaGL.Model();
  var indexOffset = 0;
  
  var makeSide = function(lowerLeft, u, v) {
    var n = vec3.cross([], u, v);
    
    var v0 = new TentaGL.Vertex(lowerLeft);
    v0.normal(n);
    v0.texST([0,0]);
    model.addVertex(v0);
    
    var v1 = new TentaGL.Vertex(vec3.add([], lowerLeft, u)); 
    v1.normal(n);
    v1.texST([1,0]);
    model.addVertex(v1);
    
    var v2 = new TentaGL.Vertex(vec3.add([], lowerLeft, vec3.add([], u, v)));
    v2.normal(n);
    v2.texST([1,1]);
    model.addVertex(v2);
    
    var v3 = new TentaGL.Vertex(vec3.add([], lowerLeft, v));
    v3.normal(n);
    v3.texST([0,1]);
    model.addVertex(v3);
    
    model.addFaceQuad(indexOffset,
                      indexOffset+1,
                      indexOffset+2,
                      indexOffset+3);
    
    indexOffset += 4;
  };
  
  makeSide([0,h,d], [w,0,0], [0,0,-d]); // top
  makeSide([0,0,0], [w,0,0], [0,0,d]); // bottom
  makeSide([0,0,d], [w,0,0], [0,h,0]); // front
  makeSide([w,0,0], [-w,0,0], [0,h,0]); // back
  makeSide([w,0,d], [0,0,-d], [0,h,0]); // right
  makeSide([0,0,0], [0,0,d], [0,h,0]); // left
  
  return model;
};

