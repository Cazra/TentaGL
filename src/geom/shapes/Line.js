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


TentaGL.Model.Line = function(xyz1, xyz2) {
  var model = new TentaGL.Model(TentaGL.GL_LINES);
  
  var v1 = new TentaGL.Vertex(xyz1[0], xyz1[1], xyz1[2]);
  v1.setNormal(0, 0, 1);
  v1.setTexST(0,0);
  model.addVertex(v1);
  
  var v2 = new TentaGL.Vertex(xyz2[0], xyz2[1], xyz2[2]);
  v2.setNormal(0, 0, 1);
  v2.setTexST(1,0);
  model.addVertex(v2);
  
  model.addLine(0, 1);
  
  return model;
};