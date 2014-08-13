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
 * Constructs a model for a series of inter-connected line segments with 
 * measurable width. 
 * @param {Array{vec3}} xyzv  The xyz coordinates for each vertex, in order, 
 *      making up the polyline.
 * @param {number} width  The width of the line segments forming the polyline.
 * @param {Boolean} closed  Whether the polyline forms a closed polygon.
 * @return {TentaGL.Model}
 * @deprecated
 */
TentaGL.Model.ThickPolyLine = function(xyzv, width, closed) {
  var model = new TentaGL.Model(GL_TRIANGLES);
  
  /** Creates the 2 points at a bend point in the thick polyline. */
  var createPoints = function(p, u, v) {
    var w = TentaGL.Math.tweenVector(u, v, 0.5);
    vec3.scale(w, w, width/2);
    
    var q = vec3.add(vec3.create(), p, w);
    var r = vec3.sub(vec3.create(), p, w);
    
    return [q, r];
  };
  
  // Figure out the vertices for the thick polyline.
  var vOuter = [];
  var vInner = [];
  
  var numPts = xyzv.length;
  for(var i=0; i < numPts; i++) {
    var cur = xyzv[i];
    var prev = xyzv[i-1];
    var next = xyzv[i+1];
    
    // Figure out the vectors to the previous and next points.
    var vecToPrev, vecToNext;
    if(closed) {
      if(i == 0) {
        prev = xyzv[numPts-1];
      }
      else if(i == numPts-1) {
        next = xyzv[0];
      }
      
      vecToNext = vec3.sub(vec3.create(), next, cur);
      vecToPrev = vec3.sub(vec3.create(), prev, cur);
    }
    else if(i == 0) {
      vecToNext = vec3.sub(vec3.create(), next, cur);
      vecToPrev = vec3.negate(vec3.create(), vecToNext);
    }
    else if(i == numPts-1) {
      vecToPrev = vec3.sub(vec3.create(), prev, cur);
      vecToNext = vec3.negate(vec3.create(), vecToPrev);
    }
    else {
      vecToNext = vec3.sub(vec3.create(), next, cur);
      vecToPrev = vec3.sub(vec3.create(), prev, cur);
    }

    // Compute the two new vertices for the bend in the polyline.
    var v = createPoints(cur, vecToNext, vecToPrev);
    vOuter.push(v[0]);
    vInner.push(v[1]);
  }
  
  console.log(vOuter, vInner);
  
  // Form the faces for the thick polyline from our vertices.
  for(var i=0; i<numPts; i++) {
    var p = vOuter[i];
    var v1 = new TentaGL.Vertex(p[0], p[1], p[2]);
    v1.setNormal(0, 0, 1);
    v1.setTexST(i, 1);
    model.addVertex(v1);
    
    var q = vInner[i];
    var v2 = new TentaGL.Vertex(q[0], q[1], q[2]);
    v2.setNormal(0, 0, 1);
    v2.setTexST(i, 0);
    model.addVertex(v2);
    
    if(i > 0) {
      var j = i*2;
      model.addFaceQuad(j, j-2, j-1, j+1);
    }
  }
  console.log(model.getVertices());
  
  
  if(closed) {
    var j = (numPts-1)*2;
    model.addFaceQuad(0, j, j+1, 1);
  }
  
  return model;
};

