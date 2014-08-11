/** 
 * Interface for a 3D shape. 
 */
TentaGL.Math.Shape3D = function() {};

TentaGL.Math.Shape3D.prototype = {
  
  constructor: TentaGL.Math.Shape3D,
  
  isaShape3D: true,
  
  /** 
   * Returns true iff this shape contains the specified point, within some tolerance. 
   * @param {vec3} pt
   * @param {float} tolerance   Optional.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {},
  
  /** 
   * Returns the smallest 3D box completely containing this shape.
   * @return {TentaGL.Math.Rect3D}
   */
  getBoundingBox: function() {},
  
  
  /** 
   * Renders the shape. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {}
};

Util.Inheritance.inherit(TentaGL.Math.Shape3D, TentaGL.Renderable);
