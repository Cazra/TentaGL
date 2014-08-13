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
 * A mathematical 3D infinite plane object.
 * @param {vec3} normal   The non-zero vector normal to the plane.
 * @param {vec3} pt      Optional. The anchor point the plane passes through. 
 *      Default: [0,0,0]
 */
TentaGL.Math.Plane = function(normal, pt) {
  if(!pt) {
    pt = [0,0,0];
  }
  
  this._normal = vec3.clone(normal);
  this._nHat = vec3.normalize(vec3.create(), this._normal);
  this._pt = vec3.clone(pt);
};


TentaGL.Math.Plane.prototype = {
  constructor: TentaGL.Math.Plane,
  
  isaInfinitePlane: true,
  
  /** 
   * Returns the plane's normal vector. 
   * @return {vec3}
   */
  getNormal: function() {
    return this._normal;
  },
  
  
  /** 
   * Returns the plane's unit normal vector. 
   * @return {vec3}
   */
  getUnitNormal: function() {
    return this._nHat;
  },
  
  
  /** 
   * Returns the anchor point the plane passes through. 
   * @return {vec3}
   */
  getPoint: function() {
    return this._pt;
  },
  
  
  /** 
   * Returns the distance of a point to this plane. 
   * @param {vec3} pt
   * @return number
   */
  distToPt: function(pt) {
    var w = vec3.sub(vec3.create(), pt, this._pt);
    var wLen = vec3.len(w);
    if(wLen == 0) {
      return 0;
    }
    
    var wHat = vec3.normalize(vec3.create(), w);
    var dot = vec3.dot(wHat, this._nHat);
    
    return Math.abs(wLen*dot);
  },
  
  
  /** 
   * Returns the coefficients a, b, c, and d that describe this plane in the 
   * standard equation for a plane: ax + by + cz + d = 0.
   * @return {array: [number, number, number, number]}
   */
  getCoefficients: function() {
    var a = this._normal[0];
    var b = this._normal[1];
    var c = this._normal[2];
    
    var x = this._pt[0];
    var y = this._pt[1];
    var z = this._pt[2];
    
    var d = -a*x - b*y - c*z;
    
    return [a, b, c, d];
  },
  
  
  /** 
   * Returns a pair of vectors that are parallel to the plane. 
   * @return {array: vec3*2}
   */
  getParallelVectors: function() {
    var p1 = this._pt;
    var p2;
    if(this._normal[0] == 0) {
      p2 = [p1[0] + 1, p1[1], p1[2]];
    }
    else if(this._normal[1] == 0) {
      p2 = [p1[0], p1[1] + 1, p1[2]];
    }
    else if(this._normal[2] == 0) {
      p2 = [p1[0], p1[1], p1[2] + 1];
    }
    else {
      var coeffs = this.getCoefficients();
      
      var x = p1[0]+1;
      var y = 0;
      var z = (-coeffs[0]*x-coeffs[3])/coeffs[2];
      
      p2 = [x, y, z];
    }
    
    var u = vec3.sub(vec3.create(), p2, p1);
    var v = vec3.cross(vec3.create(), u, this._normal);
    
    return [u, v];
  },
  
  
  /** 
   * Determines if this plane contains the specified point.
   * A point is contained by the plane if its distance to the plane is within
   * some tolerance close to 0.
   * @param {vec3} pt
   * @param {ufloat) tolerance  Optional. Default 0.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var c = this.getCoefficients();
    var result = c[0]*pt[0] + c[1]*pt[1] + c[2]*pt[2] + c[3];
    
    return (Math.abs(result) < tolerance);
  },
  
  
  
  /** 
   * Returns an indicator for the position of a point relative to this plane.  
   * 1 indicates that the point lies above the plane in the direction of its
   * normal vector. -1 indicates that the point lies below the plane in the 
   * direction of its inverse normal vector. 0 indicates that the 
   * point lies on the plane, but is prone to rounding error.
   * @param {vec3} pt
   * @return {int}
   */
  ptRelative: function(pt) {
    var u = vec3.sub(vec3.create(), pt, this._pt);
    vec3.normalize(u, u);
    
    var dot = vec3.dot(this._nHat, u);
    
    if(dot > 0) {
      return 1;
    }
    else if(dot < 0) {
      return -1;
    }
    else {
      return 0;
    }
  },
  
  /** 
   * Tests if a point lies above the plane in the direction 
   * of its normal vector.
   * @param {vec3} pt
   * @return {boolean}
   */
  ptIsAbove: function(pt) {
    return (ptRelative(pt) == 1);
  },
  
  /** 
   * Tests if a point lies below the plane in the direction 
   * of its inverse normal vector.
   * @param {vec3} pt
   * @return {boolean}
   */
  ptIsBelow: function(pt) {
    return (ptRelative(pt) == -1);
  },
  
  
  /** 
   * Determines the intersection of a line with this plane. There are 3 possible
   * returned values: A point (vec3} if the line intersects the plane at a
   * single point (the most common case), the line if the line lies in the
   * plane, or undefined if the line is parallel to the plane but not in it.
   * See http://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
   * @param {TentaGL.Math.Line3D} line
   * @return {vec3, TentaGL.Math.Line3D, or undefined}
   */
  lineIntersection: function(line) {
    var q = this.getPoint();
    var p = line.getPt1();
    
    var n = this.getNormal();
    var u = line.getVec3();
    
    var numer = vec3.dot(n, vec3.sub(vec3.create(), q, p));
    var denom = vec3.dot(n, u);
    
    if(denom == 0) {
      if(numer == 0) {
        return line;
      }
      else {
        return undefined;
      }
    }
    else {
      var s = numer/denom;
      
      var x = p[0] + s*u[0];
      var y = p[1] + s*u[1];
      var z = p[2] + s*u[2];
      
      return vec4.fromValues(x, y, z, 1);
    }
  },
  
  
  /** 
   * Determines the intersection of a line segment with this plane. 
   * There are 3 possible values returned:
   * If the segment intersects the plane at exactly one point, that point is returned.
   * If the segment lies on the plane, the segment is returned.
   * If the segment doesn't intersect the plane anywhere, undefined is returned.
   * See http://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
   * @param {TentaGL.Math.Line3D} line
   * @return {vec3, TentaGL.Math.Line3D, or undefined}
   */
  segmentIntersection: function(line) {
    var q = this.getPoint();
    var p = line.getPt1();
    
    var n = this.getNormal();
    var u = line.getVec3();
    
    var numer = vec3.dot(n, vec3.sub(vec3.create(), q, p));
    var denom = vec3.dot(n, u);
    
    if(denom == 0) {
      if(numer == 0) {
        return line;
      }
      else {
        return undefined;
      }
    }
    else {
      var s = numer/denom;
      
      var x = p[0] + s*u[0];
      var y = p[1] + s*u[1];
      var z = p[2] + s*u[2];
      
      var pt = vec4.fromValues(x, y, z, 1);
      var a;
      
      if(u[0] != 0) {
        a = (pt[0] - p[0])/u[0];
      }
      else if(u[1] != 0) {
        a = (pt[1] - p[1])/u[1];
      }
      else {
        a = (pt[2] - p[2])/u[2];
      }
      
      if(a >= 0 && a <= 1) {
        return pt;
      }
      else {
        return undefined;
      }
    }
  },
  
  
  
  /**  
   * A plane is infinite, and therefore unbounded. So this returns undefined.
   */
  getBoundingBox: function() {
    return undefined;
  },
  
  
  /** 
   * Returns a quad lying on the plane. 
   */
  getQuad: function() {
    var uv = this.getParallelVectors();
    
    return new TentaGL.Math.Quad(this._pt, uv[0], uv[1]);
  },
  
  
  
  /** 
   * Renders the plane (only the region bounded by the viewing volume).
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    TentaGL.ViewTrans.push(gl);
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    
    // Determine the points where the plane intersects the view volume.
    var vvPts = TentaGL.ViewTrans.getCamera(gl).getViewVolumeCorners(gl.canvas.width, gl.canvas.height);
    var vvEdges = [];
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[0], vvPts[1]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[1], vvPts[2]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[2], vvPts[3]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[3], vvPts[0]));
    
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[4], vvPts[5]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[5], vvPts[6]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[6], vvPts[7]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[7], vvPts[4]));
    
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[0], vvPts[4]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[1], vvPts[5]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[2], vvPts[6]));
    vvEdges.push(new TentaGL.Math.Line3D(vvPts[3], vvPts[7]));
    
    var iPts = [];
    for(var i=0; i < vvEdges.length; i++) {
      var pt = this.segmentIntersection(vvEdges[i]);
      if(pt !== undefined && !pt.isaLine3D) {
        iPts.push(pt);
      }
    }
    
    // Construct a model from the intersection points.
    if(iPts.length > 2) {
      var model = new TentaGL.Model(GL_TRIANGLES, GL_NONE);
      
      var uv = this.getParallelVectors();
      
      for(var i=0; i < iPts.length; i++) {
        var vertex = new TentaGL.Vertex(iPts[i]);
        vertex.normal(this._normal);
        vertex.st(0, 0);
        
        model.addVertex(vertex);
      }
      
      /*
      for(var i=0; i < iPts.length-2; i++) {
        for(var j=i+1; j < iPts.length-1; j++) {
          for(var k=j+1; k < iPts.length; k++) {
            model.addFace(i,j,k);
          }
        }
      }
      */
      
      // Create a set of faces for the plane that are non-overlapping.
      var iPtsTran = [];
      var m = mat4.create();
      mat4.translate(m, m, vec3.negate([], this._pt));
      var q = TentaGL.Math.getQuatFromTo(this._normal, [0,0,1]);
      mat4.mul(m, mat4.fromQuat([], q), m);
      
      for(var i=0; i < iPts.length; i++) {
        // Transform the points so that they all lie on the XY plane.
        iPtsTran.push(vec3.transformMat4([], iPts[i], m));
        iPtsTran[i][2] = 0;
        iPtsTran[i][3] = i;
      }
      
      // Sort the points based on the angle of their vector from the center 
      // of area, in the range [0, TAU).
      var cPt = [0,0,0];
      for(var i=0; i <iPtsTran.length; i++) {
        vec3.add(cPt, cPt, vec3.scale([], iPtsTran[i], 1/iPtsTran.length));
      }
      
      iPtsTran.sort(function(a, b) {
        
        var u = vec3.sub([], a, cPt);
        var dirU = vec3.cross([], [1,0,0], u)[2];
        var angleU = TentaGL.Math.vectorAngle([1,0,0], u);
        if(dirU < 0) {
          angleU = TentaGL.TAU - angleU;
        }
        
        var v = vec3.sub([], b, cPt);
        var dirV = vec3.cross([], [1,0,0], v)[2];
        var angleV = TentaGL.Math.vectorAngle([1,0,0], v);
        if(dirV < 0) {
          angleV = TentaGL.TAU - angleV;
        }
        
        return angleV - angleU;
      });
      
      console.log(iPtsTran);
      
      // Create a fan from point 0, using the untransformed points.
      for(var i=2; i < iPtsTran.length; i++) {
        var i0 = iPtsTran[0][3];
        var i1 = iPtsTran[i-1][3];
        var i2 = iPtsTran[i][3];
        
        model.addFace(i0, i1, i2);
      }
      
      
      // tangental cannot be autocomputed since texture coordinates are all 0,0.
      for(var i=0; i < iPts.length; i++) {
        var vertex = model.getVertex(i);
        vertex.tangental([uv[0]]);
      }
      
      // Render the model.
      var vbo = new TentaGL.VBOData(gl, model);
      TentaGL.ViewTrans.updateMVPUniforms(gl);
      TentaGL.VBORenderer.render(gl, vbo);
      vbo.clean(gl);
    }
    TentaGL.ViewTrans.pop(gl);
  }
  
};


Util.Inheritance.inherit(TentaGL.Math.Plane, TentaGL.Math.Shape3D);

