/** 
 * Interface for a 2D shape.
 */
TentaGL.Math.Shape2D = function() {};

TentaGL.Math.Shape2D.prototype = {
  
  constructor: TentaGL.Math.Shape2D,
  
  isaShape2D: true,
  
  /** 
   * Returns true iff the specified point is contained within this shape.
   * @param {vec2} pt
   * @return {boolean}
   */
  containsPt: function(pt) {},
  
  /** 
   * Returns the smallest rectangle containing the shape. 
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {},
  
  
  /** 
   * Renders the shape. Many shapes use a specialized shader to render 
   * themselves on a rectangular area.
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName   Optional.
   */
  render: function(gl, materialName) {}
};

Util.Inheritance.inherit(TentaGL.Math.Shape2D, TentaGL.Renderable);

