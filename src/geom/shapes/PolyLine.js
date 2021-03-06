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
 * Constructs a model for a series of inter-connected line segments. 
 * @param {Array{vec3}} xyzv  The xyz coordinates for each vertex, in order, 
 *      making up the polyline.
 * @param {Boolean} closed  Whether the polyline forms a closed polygon.
 * @return {TentaGL.Model}
 */
TentaGL.Model.PolyLine = function(xyzv, closed) {
  var model = new TentaGL.Model(GL_LINES);
  
  for(var i=0; i<xyzv.length; i++) {
    var xyz = xyzv[i];
    var vertex = new TentaGL.Vertex(xyz);
    vertex.normal([0,0,1]);
    vertex.texST([i,0]);
    model.addVertex(vertex);
    
    if(i>0) {
      model.addLine(i-1, i);
    }
  }
  
  if(closed) {
    model.addLine(xyzv.length-1, 0);
  }
  
  return model;
};

