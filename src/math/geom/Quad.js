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
    
    this._n = vec3.cross(vec3.create(), u, v);
    vec3.normalize(this._n, this._n);
    
    this._initModel();
  },
  
  
  _initModel: function() {
    this._model = new TentaGL.Model(GL_TRIANGLES, GL_NONE);
    
    var v0 = new TentaGL.Vertex(this._pts[0]);
    v0.setNormal(this._n[0], this._n[1], this._n[2]);
    v0.setTexST(0,0);
    this._model.addVertex(v0);
    
    var v1 = new TentaGL.Vertex(this._pts[1]);
    v1.setNormal(this._n[0], this._n[1], this._n[2]);
    v1.setTexST(1, 0);
    this._model.addVertex(v1);
    
    var v2 = new TentaGL.Vertex(this._pts[2]);
    v2.setNormal(this._n[0], this._n[1], this._n[2]);
    v2.setTexST(1,1);
    this._model.addVertex(v2);
    
    var v3 = new TentaGL.Vertex(this._pts[3]);
    v3.setNormal(this._n[0], this._n[1], this._n[2]);
    v3.setTexST(0, 1);
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
  
  
  /** 
   * Renders the quad. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    var vbo = new TentaGL.VBOData(gl, this._model, TentaGL.getDefaultAttrProfileSet());
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    
    TentaGL.VBORenderer(gl, vbo);
    vbo.clean();
  }
};


Util.Inheritance.inherit(TentaGL.Math.Quad, TentaGL.Renderable);

