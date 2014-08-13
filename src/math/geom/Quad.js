/** 
 * A parallelogram in 3D space.
 * @constructor
 * @param {vec3} pt
 * @param {vec3} u  A vector defining one side of the shape projected from pt.
 * @param {vec3} v  A vector defining the other side of the shape projected from pt.
 */
TentaGL.Math.Quad = function(pt, u, v) {
  this._pts = [];
  this._pts[0] = pt;
  
  this._u = u;
  this._v = v;
  
  this._update();
};

TentaGL.Math.Quad.prototype = {
  
  constructor: TentaGL.Math.Quad,
  
  isaQuad: true,
  
  _update: function() {
    this._pts[1] = vec3.add(vec3.create(), this._pts[0], this._u);
    this._pts[2] = vec3.add(vec3.create(), this._pts[1], this._v);
    this._pts[3] = vec3.add(vec3.create(), this._pts[0], this._v);
    
    this._n = vec3.cross(vec3.create(), this._u, this._v);
    vec3.normalize(this._n, this._n);
    
    this._initModel();
  },
  
  
  _initModel: function() {
    this._model = new TentaGL.Model(GL_TRIANGLES, GL_NONE);
    
    var v0 = new TentaGL.Vertex(this._pts[0]);
    v0.normal(this._n);
    v0.st([0,0]);
    this._model.addVertex(v0);
    
    var v1 = new TentaGL.Vertex(this._pts[1]);
    v1.normal(this._n);
    v1.st(1, 0);
    this._model.addVertex(v1);
    
    var v2 = new TentaGL.Vertex(this._pts[2]);
    v2.normal(this._n);
    v2.st(1,1);
    this._model.addVertex(v2);
    
    var v3 = new TentaGL.Vertex(this._pts[3]);
    v3.normal(this._n);
    v3.st(0, 1);
    this._model.addVertex(v3);
    
    this._model.addFaceQuad(0, 1, 2, 3);
  },
  
  
  //////// Metrics
  
  
  /** 
   * Returns the nth point going counter-clockwise around the quad. 
   * @param {uint} n
   */
  getPt: function(n) {
    n = TentaGL.Math.clamp(n, 0, 3);
    return this._pts[n];
  },
  
  
  /** 
   * Setter/getter for the 1st point in the quad from which vectors u and v 
   * are projected.
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  pt: function(xyz) {
    if(xy !== undefined) {
      this._pts[0] = xyz;
      this._update();
    }
    return this._pts[0];
  },
  
  
  /** 
   * Setter/getter for vector u. 
   * @param {vec3} xyz    Optional.
   * @return {vec3}
   */
  u: function(xyz) {
    if(xyz !== undefined) {
      this._u = xyz;
      this._update();
    }
    return this._u;
  },
  
  
  /** 
   * Setter/getter for vector v.
   * @param {vec3} xyz    Optional.
   * @return {vec3}
   */
  v: function(xyz) {
    if(xyz !== undefined) {
      this._v = xyz;
      this._update();
    }
    return this._v;
  },
  
  
  //////// Collisions
  
  
  /** 
   * Returns true iff the specified point is contained by this shape. 
   * @param {vec3} pt
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var m = mat3.create();
    var p = this._pts[0];
    
    m[0] = this._u[0];
    m[1] = this._u[1];
    m[2] = this._u[2];
    m[3] = this._v[0];
    m[4] = this._v[1];
    m[5] = this._v[2];
    m[6] = p[0];
    m[7] = p[1];
    m[8] = p[2];
    
    var mInv = mat3.invert(mat3.create(), m);
    
    
    var coeffs = vec3.create();
    vec3.transformMat3(coeffs, pt, mInv);
    var a = coeffs[0];
    var b = coeffs[1];
    
    return (a >= 0 && a <= 1 && b >= 0 && b <= 1 && Math.abs(coeffs[2] - 1) <= tolerance);
  },
  
  
  /** 
   * Returns the smallest 3D box completely containing this shape.
   * @return {TentaGL.Math.Rect3D}
   */
  getBoundingBox: function() {
    var left = this._pts[0][0];
    var right = this._pts[0][0];
    
    var top = this._pts[0][1];
    var bottom = this._pts[0][1];
    
    var front = this._pts[0][2];
    var back = this._pts[0][2];
    
    
    for(var i=1; i <= 3; i++) {
      var pt = this._pts[i];
      if(pt[0] < left) {
        left = pt[0];
      }
      if(pt[0] > right) {
        right = pt[0];
      }
      
      if(pt[1] < bottom) {
        bottom = pt[1];
      }
      if(pt[1] > top) {
        top = pt[1];
      }
      
      if(pt[2] < back) {
        back = pt[2];
      }
      if(pt[2] > front) {
        front = pt[2];
      }
    }
    
    
    var width = right - left;
    var height = top - bottom;
    var depth = front - back;
    
    return new TentaGL.Math.Rect3D([left, bottom, back], width, height, depth);
  },
  
  
  
  //////// Rendering
  
  /** 
   * Renders the quad. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    this._model.render(gl);
  }
};


Util.Inheritance.inherit(TentaGL.Math.Quad, TentaGL.Math.Shape3D);

