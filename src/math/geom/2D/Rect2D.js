/**
 * A 2D rectangle.
 * @constructor
 * @param {vec2} pt   The lower-left corner of the rectangle. In a traditional 
 *      2D system, this is the upper-left corner.
 * @param {number} w
 * @param {number} h (optional. Default h = w (a square).)
 */
TentaGL.Math.Rect2D = function(pt, w, h) {
  if(h === undefined) {
    h = w;
  }
  
  this._xy = pt;
  this._w = w;
  this._h = h;
};

TentaGL.Math.Rect2D.prototype = {
  
  constructor: TentaGL.Math.Rect2D, 
  
  isaRect2D: true,
  
  
  /** 
   * Creates a cloned copy of this shape. 
   * @return {TentaGL.Math.Rect2D}
   */
  clone: function() {
    return new TentaGL.Math.Rect2D(this._xy.slice(0), this._w, this._h);
  },
  
  
  /** 
   * Converts the shape to a Rect3D with z = 0 and depth = 0. 
   * @return {
   */
  toRect3D: function() {
    return new TentaGL.Math.Rect3D([this._xy[0], this._xy[1], 0], this._w, this._h, 0);
  },
  
  
  //////// Metrics
  
  
  /** 
   * Setter/getter for the x, y position lower-left point of the rectangle. 
   * @param {vec2} xy   Optional.
   * @return {vec2} 
   */
  xy: function(xy) {
    if(xy !== undefined) {
      this._xy = xy;
    }
    return this._xy;
  },
  
  
  /** 
   * Setter/getter for the x position of the rectangle's left edge. 
   * @param {number} x    Optional.
   * @return {number}
   */
  x: function(x) {
    if(x !== undefined) {
      this._xy[0] = x;
    }
    return this._xy[0];
  },
  
  
  /** 
   * Setter/getter for the y position of the rectangle's bottom edge. 
   * (assuming y increases upwards)
   * @param {number} y    Optional.
   * @return {number}
   */
  y: function(y) {
    if(y !== undefined) {
      this._xy[1] = y;
    }
    return this._xy[1];
  },
  
  
  /**  
   * Setter/getter for the width of the rectangle.
   * @param {number} w   Optional.
   * @return {number}
   */
  width: function(w) {
    if(w !== undefined) {
      this._w = w;
    }
    return this._w;
  },
  
  
  
  /**
   * Setter/getter for the height of the rectangle.
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
   * Setter/getter for the rectangle as a 4-element array.
   * @param {array: [x, y, width, height]} xywh   Optional.
   * @return {array: [x, y, width, height]}
   */
  xywh: function(xywh) {
    if(xywh !== undefined) {
      this._xy = xywh.slice(0, 2);
      this._w = xywh[2];
      this._h = xywh[3];
    }
    return [this._xy[0], this._xy[1], this._w, this._h];
  },
  
  
  //////// Collisions
  
  
  /** 
   * Returns whether a 2D point is contained within the area of this rectangle.
   * @param {vec2} pt
   * @return {boolean}
   */
  containsPt: function(pt) {
    return !(pt[0] < this._xy[0] || pt[1] < this._xy[1] || pt[0] > this._xy[0] + this._w || pt[1] > this._xy[1] + this._h)
  },
  
  
  /** 
   * Returns the shape's bounding box. Since this shape is a rectangle, this 
   * returns a clone of this rectangle.
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {
    return this.clone();
  },
  
  
  /** 
   * Returns the rectangle resulting from the intersection between this and
   * another rectangle, or undefined if there is no intersection.
   * @param {TentaGL.Math.Rect2D} rect
   * @return {TentaGL.Math.Rect2D}
   */
  intersection: function(rect) {
    if(!this.intersectsRect(rect)) {
      return undefined;
    }
    else {
      var left = Math.max(this._xy[0], rect._xy[0]);
      var right = Math.min(this._xy[0] + this._w, rect._xy[0] + rect._w);
      var bottom = Math.max(this._xy[1], rect._xy[1]);
      var top = Math.min(this._xy[1] + this._h, rect._xy[1] + rect._h);
      
      var width = right - left;
      var height = top - bottom;
      
      return new TentaGL.Math.Rect2D([left, bottom], width, height);
    }
  },
  
  
  /** 
   * Returns whether this intersects another rectangle. 
   * @param {TentaGL.Math.Rect2D} rect
   * @return {boolean}
   */
  intersectsRect: function(rect) {
    return !( this._xy[0] > rect._xy[0] + rect._w ||
        this._xy[0] + this._w < rect._xy[0] ||
        this._xy[1] > rect._xy[1] + rect._h ||
        this._xy[1] + this._h < rect._xy[1] );
  },
  
  
  /** 
   * Returns whether this intersects a line.
   * @param {TentaGL.Math.Line2D} line
   * @return {boolean}
   */
  intersectsLine: function(line) {
    if(this.containsPt(line.getPt1()) || this.containsPt(line.getPt2())) {
      // The line intersects this if either of its endpoints are inside.
      
      return true;
    }
    else {
      // The line intersects if it intersects with any of the 4 edges.
      var top = this._xy[1] + this._h;
      var bottom = this._xy[1];
      var left = this._xy[0];
      var right = this._xy[0] + this._w;
      
      return (line.intersects(new TentaGL.Math.Line2D([left, top], [right, top])) || 
              line.intersects(new TentaGL.Math.Line2D([left, bottom], [right, bottom])) ||
              line.intersects(new TentaGL.Math.Line2D([left, top], [left, bottom])) ||
              line.intersects(new TentaGL.Math.Line2D([right, top], [right, bottom])));     
    }
  },
  
  
  /** 
   * Returns the smallest rectangle containing both this and another rectangle. 
   * @param {TentaGL.Math.Rect2D} rect
   * @return {TentaGL.Math.Rect2D}
   */
  commonRect: function(rect) {
    if(!rect) {
      return this.clone();
    }
    
    var left = Math.min(this._xy[0], rect._xy[0]);
    var right = Math.max(this._xy[0] + this._w, rect._xy[0] + rect._w);
    var bottom = Math.min(this._xy[1], rect._xy[1]);
    var top = Math.max(this._xy[1] + this._h, rect._xy[1] + rect._h);
    
    var width = right - left;
    var height = top - bottom;
    
    return new TentaGL.Math.Rect2D([left, bottom], width, height);
  },
  
  
  //////// Rendering
  
  
  /** 
   * Renders the rectangle.
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    TentaGL.ViewTrans.push(gl);
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    } 
    TentaGL.ViewTrans.translate(gl, this._xy);
    TentaGL.ViewTrans.scale(gl, [this._w, this._h]);
    TentaGL.ModelLib.render(gl, "unitPlane");
    
    TentaGL.ViewTrans.pop(gl);
  }
  
  
};

Util.Inheritance.inherit(TentaGL.Math.Rect2D, TentaGL.Math.Shape2D);
