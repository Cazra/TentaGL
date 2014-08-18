/** 
 * A 2D ellipse.
 * @constructor
 * @param {vec2} pt   The center of the ellipse.
 * @param {number} rx   The radius of the ellipse along the X axis.
 * @param {number} ry   Optional. The radius of the ellipse along the Y axis. 
 *                      Default ry = rx (forms a circle).
 */
TentaGL.Math.Ellipse2D = function(pt, rx, ry) {
  if(ry === undefined) {
    ry = rx;
  }
  
  this._pt = pt;
  this._rx = rx;
  this._ry = ry;
};

TentaGL.Math.Ellipse2D.prototype = {
  
  constructor: TentaGL.Math.Ellipse2D,
  
  isaEllipse2D: true,
  
  /** 
   * Returns a cloned copy of this shape.
   * @return {TentaGL.Math.Ellipse2D}
   */
  clone: function() {
    return new TentaGL.Math.Ellipse2D(this._pt.slice(0), this._rx, this._ry);
  },
  
  
  //////// Metrics
  
  /** 
   * Setter/getter for the X coordinates of the ellipse's center.
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
   * Setter/getter for the Y coordinates of the ellipse's center.
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
   * Setter/getter for the ellipse's center point. 
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  xy: function(xy) {
    if(xy !== undefined) {
      this._pt = vec2.clone(xy);
    }
    return vec2.clone(this._pt);
  },
  
  
  /** 
   * Setter/getter for the radius of the ellipse, as a circle.
   * @param {number} r    Optional.
   * @return {number}
   */
  radius: function(r) {
    if(r !== undefined) {
      this._rx = r;
      this._ry = r;
    }
    return this._rx;
  },
  
  /** 
   * Setter/getter for the ellipse's X radius.
   * @param {number} r    Optional.
   * @return {number}
   */
  radiusX: function(r) {
    if(r !== undefined) {
      this._rx = r;
    }
    return this._rx;
  },
  
  /** 
   * Setter/getter for the ellipse's Y radius.
   * @param {number} r    Optional.
   * @return {number}
   */
  radiusY: function(r) {
    if(r !== undefined) {
      this._ry = r;
    }
    return this._ry;
  },
  
  
  
  //////// Collisions
  
  
  /** 
   * Returns true iff this ellipse contains the specified point.
   * @param {vec2} pt
   * @return {boolean}
   */
  containsPt: function(pt) {
    // We'll transform the system so that we are comparing the pt to a unit circle.
    pt = pt.slice(0);
    
    // Move ellipse to origin.
    pt[0] -= this._pt[0];
    pt[1] -= this._pt[1];
    
    // Scale to unit circle.
    var scale = mat3.create();
    mat3.scale(scale, scale, [1/this._rx, 1/this._ry, 0]);
    vec2.transformMat3(pt, pt, scale);
    
    // The point is contained in our ellipse if the transformed point is 
    // contained within our unit circle.
    return (pt[0]*pt[0] + pt[1]*pt[1] <= 1);
  },
  
  
  /** 
   * Returns the bounding box of this shape.
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {
    var left = this._pt[0] - this._rx;
    var bottom = this._pt[1] - this._ry;
    
    return new TentaGL.Math.Rect2D([left, bottom, this._rx*2, this._ry*2]);
  },
  
  
  //////// Rendering
  
  /** 
   * Renders the ellipse. 
   * Requires TentaGL.CircleShader to be loaded.
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    TentaGL.ShaderLib.push(gl);
    TentaGL.ViewTrans.push(gl);
    
    TentaGL.ShaderLib.use(gl, gl._circleShaderProgramName);
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    
    TentaGL.ViewTrans.translate(gl, this._pt);
    TentaGL.ViewTrans.scale(gl, [this._rx*2, this._ry*2]);
    TentaGL.ViewTrans.translate(gl, [-0.5, -0.5]);
    TentaGL.ModelLib.render(gl, "unitPlane");
    
    TentaGL.ViewTrans.pop(gl);
    TentaGL.ShaderLib.pop(gl);
  }
};


/** 
 * Produces an ellipse from a rectangular bounding area.
 * @param {TentaGL.Math.Rect2D} rect
 * @return {TentaGL.Math.Ellipse2D}
 */
TentaGL.Math.Ellipse2D.fromRect = function(rect) {
  var rx = rect.width()/2;
  var ry = rect.height()/2;
  
  var x = rect.x() + rx;
  var y = rect.y() + ry;
  
  return new TentaGL.Math.Ellipse2D([x,y], rx, ry);
};


Util.Inheritance.inherit(TentaGL.Math.Ellipse2D, TentaGL.Math.Shape2D);

