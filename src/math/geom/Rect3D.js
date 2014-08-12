/** 
 * A 3D rectangle/box.
 * @param {vec3} pt   The shape's origin point - the lower-left-back corner of the shape.
 * @param {number} width
 * @param {number} height
 * @param {number} depth
 */
TentaGL.Math.Rect3D = function(pt, width, height, depth) {
  this._pt = pt.slice(0);
  this._w = width;
  this._h = height;
  this._d = depth;
};

TentaGL.Math.Rect3D.prototype = {
  
  constructor: TentaGL.Math.Rect3D,
  
  isaRect3D: true,
  
  /** 
   * Returns a cloned copy of this shape. 
   * @return {TentaGL.Math.Rect3D}
   */
  clone: function() {
    return new TentaGL.Math.Rect3D(this._pt, this._w, this._h, this._d);
  },
  
  
  //////// Metrics
  
  /** 
   * Setter/getter for the shape's origin point. 
   */
  xyz: function(xyz) {
    if(xyz !== undefined) {
      this._pt = xyz.slice(0);
    }
    return xyz.slice(0);
  },
  
  
  /** 
   * Setter/getter for the X coordinate of the shape's origin.
   * @param {number} x    Optional.
   * @return {number}
   */
  x: function(x) {
    if(x !== undefined) {
      this._pt[0] = x;
    }
    return this._pt[0];
  },
  
  
  /** 
   * Setter/getter for the Y coordinate of the shape's origin.
   * @param {number} y    Optional.
   * @return {number}
   */
  y: function(y) {
    if(y !== undefined) {
      this._pt[1] = y;
    }
    return this._pt[1];
  },
  
  
  /** 
   * Setter/getter for the Z coordinate of the shape's origin.
   * @param {number} z    Optional.
   * @return {number}
   */
  z: function(z) {
    if(z !== undefined) {
      this._pt[2] = z;
    }
    return this._pt[2];
  },
  
  
  /** 
   * Setter/getter for the shape's width.
   * @param {number} w    Optional.
   * @return {number}
   */
  width: function(w) {
    if(w !== undefined) {
      this._w = w;
    }
    return this._w;
  },
  
  
  /** 
   * Setter/getter for the shape's height.
   * @param {number} h    Optional.
   * @return {number}
   */
  height: function(h) {
    if(h !== undefined) {
      this._h = h;
    }
    return this._h;
  },
  
  
  /** 
   * Setter/getter for the shape's depth.
   * @param {number} d    Optional.
   * @return {number}
   */
  depth: function(d) {
    if(d !== undefined) {
      this._d = d;
    }
    return this._d;
  },
  
  
  //////// Edges
  
  /** 
   * Returns the 12 edges of the shape. 
   * @return {array: TentaGL.Math.Line3D*10}
   */
  getEdges: function() {
    var edges = [];
    
    var left = this._pt[0];
    var bottom = this._pt[1];
    var back = this._pt[2];
    
    var right = left + this._w;
    var top = bottom + this._h;
    var front = back + this._d;
    
    edges.push(new TentaGL.Math.Line3D([left, bottom, back], [right, bottom, back]));
    edges.push(new TentaGL.Math.Line3D([left, bottom, back], [left, top, back]));
    edges.push(new TentaGL.Math.Line3D([left, bottom, back], [left, bottom, front]));
    edges.push(new TentaGL.Math.Line3D([left, top, back], [right, top, back]));
    edges.push(new TentaGL.Math.Line3D([left, top, back], [left, top, front]));
    edges.push(new TentaGL.Math.Line3D([right, bottom, back], [right, top, back]));
    edges.push(new TentaGL.Math.Line3D([left, bottom, front], [left, top, front]));
    edges.push(new TentaGL.Math.Line3D([left, bottom, front], [right, bottom, front]));
    edges.push(new TentaGL.Math.Line3D([right, bottom, back], [right, bottom, front]));
    edges.push(new TentaGL.Math.Line3D([right, top, front], [left, top, front]));
    edges.push(new TentaGL.Math.Line3D([right, top, front], [right, bottom, front]));
    edges.push(new TentaGL.Math.Line3D([right, top, front], [right, top, back]));
    
    return edges;
  },
  
  
  //////// Collisions
  
  /** 
   * Returns true iff this shape contains the specified point. 
   * @param {vec3} pt
   * @param {float} tolerance   Ignored, but included to adhere to Shape3D interface.
   */
  containsPt: function(pt, tolerance) {
    return !( pt[0] < this.x() || pt[0] > this.x() + this.width() ||
              pt[1] < this.y() || pt[1] > this.y() + this.height() ||
              pt[2] < this.z() || pt[2] > this.z() + this.depth() );
  },
  
  
  /** 
   * Returns the bounding box of this shape. Since this shape is a Rect3D, 
   * a clone of this shape is returned. 
   */
  getBoundingBox: function() {
    return this.clone();
  },
  
  //////// Rendering
  
  /** 
   * Renders the shape. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    TentaGL.ViewTrans.push(gl);
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    
    TentaGL.ViewTrans.translate(gl, this._pt);
    TentaGL.ViewTrans.scale(gl, [this._w, this._h, this._d]);
    TentaGL.ModelLib.render(gl, "unitCube");
    
    TentaGL.ViewTrans.pop(gl);
  }
  
};


Util.Inheritance.inherit(TentaGL.Math.Rect3D, TentaGL.Math.Shape3D);
