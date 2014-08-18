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
 * Constructs a sprite (some transformable entity existing at a point in 
 * 3D space) at the specified world coordinates.
 * Most sprite properties are only useful if the ShaderProgram provides uniform
 * variables to use them. 
 *
 * However, TentaGL requires shaders to mind a mvpTrans uniform and a 
 * normalTrans uniform. This should be done through the ShaderProgram's 
 * bindMVPTransUni and bindNormalTransUni methods after the 
 * ShaderProgram is created, but before any sprites are rendered.
 * @constructor
 * @param {vec3} xyz  Optional. If the sprite's world coordinates aren't 
 *      provided, they will be set to [0, 0, 0]. 
 */
TentaGL.Sprite = function(xyz) {
  TentaGL.SceneNode.call(this, xyz);
  
  this._anchorXYZ = vec4.fromValues(0, 0, 0, 1);
};


TentaGL.Sprite.prototype = {
  
  constructor:TentaGL.Sprite,
  
  isaSprite:true,
  
  //////// Anchor point
  
  /** 
   * Returns the x coordinate of the sprite's anchor point. 
   * @return {Number}
   */
  getAnchorX:function() {
    return this._anchorXYZ[0];
  },
  
  /** 
   * Returns the y coordinate of the sprite's anchor point. 
   * @return {Number}
   */
  getAnchorY:function() {
    return this._anchorXYZ[1];
  },
  
  /** 
   * Returns the z coordinate of the sprite's anchor point. 
   * @return {Number}
   */
  getAnchorZ:function() {
    return this._anchorXYZ[2];
  },
  
  
  /** 
   * Setter/getter for the sprite's anchor point. This is the offset of the sprite's 
   * rendered image/model relative to its actual position. When used as a setter,
   * the z component of xyz may be omitted for 2D sprites.
   * @param {vec3} xyz    Optional.
   * @return {vec3}
   */
  anchor: function(xyz) {
    if(xyz !== undefined) {
      if(!xyz[2]) {
        // The Z component can be left out for 2D sprites.
        xyz[2] = 0;
      }
      this._anchorXYZ = vec4.fromValues(xyz[0], xyz[1], xyz[2], 1);
    }
    return this._anchorXYZ;
  },
  
  
  //////// Metrics
  
  
  /** 
   * Returns the unscaled width of the sprite (its size in the direction of its X axis). 
   * The default implementation returns 0. 
   * This should be overridden if dimensions matter for this sprite 
   * (such as for computing collisions).
   */
  getWidth: function() {
    return 0;
  },
  
  
  /** 
   * Returns the unscaled height of the sprite (its size in the direction of its Y axis). 
   * The default implementation returns 0. 
   * This should be overridden if dimensions matter for this sprite 
   * (such as for computing collisions).
   */
  getHeight: function() {
    return 0;
  },
  
  /** 
   * Returns the unscaled depth of the sprite (its size in the direction of its Z axis). 
   * The default implementation returns 0. 
   * This should be overridden if dimensions matter for this sprite 
   * (such as for computing collisions).
   */
  getDepth: function() {
    return 0;
  },
  
  
  /** 
   * Returns the dimensions of this sprite. 
   * @return {[width: number, height: number, depth: number]}
   */
  getDimensions: function() {
    return [this.getWidth(), this.getHeight(), this.getDepth()];
  },
  
  
  /** 
   * Returns the 2D bounding box of this sprite. 
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {
    return new TentaGL.Math.Rect2D([this._xyz[0], this._xyz[1]], this.getWidth(), this.getHeight());
  },
  
  
  /** 
   * Returns the 3D bounding box of this sprite.
   * @return {TentaGL.Math.Rect3D}
   */
  getBounds3D: function() {
    return new TentaGL.Math.Rect3D(this._xyz, this.getWidth(), this.getHeight(), this.getDepth());
  },
  
  
  //////// Transform
  
  
  /** The model transform for sprites also needs to take into account anchor points. */
  getTRSTransform:function() {
    var tx = this.x();
    var ty = this.y();
    var tz = this.z();
    
    var ax = 0-this.getAnchorX();
    var ay = 0-this.getAnchorY();
    var az = 0-this.getAnchorZ();
    
    var sUni = this.scaleU();
    var scaleX = this.scaleX()*sUni;
    var scaleY = this.scaleY()*sUni;
    var scaleZ = this.scaleZ()*sUni;
    
    var m = this._transform; 
    mat4.fromQuat(m, this.getQuat());
    m[0] *= scaleX;
    m[1] *= scaleX;
    m[2] *= scaleX;
    
    m[4] *= scaleY;
    m[5] *= scaleY;
    m[6] *= scaleY;
    
    m[8] *= scaleZ;
    m[9] *= scaleZ;
    m[10] *= scaleZ;
    
    m[12] = ax*m[0] + ay*m[4] + az*m[8] + tx;
    m[13] = ax*m[1] + ay*m[5] + az*m[9] + ty;
    m[14] = ax*m[2] + ay*m[6] + az*m[10] + tz;
    m[15] = 1;
    
    return m;
  },
  
  //////// Rendering

  
  /** 
   * Sets the materials for and draws the Models making up this sprite. 
   * Override this. 
   */
  draw:function(gl) {}
};


Util.Inheritance.inherit(TentaGL.Sprite, TentaGL.SceneNode);




/** 
 * Creates a simple, generic sprite which renders using a specified model, 
 * material, material lighting properties, and shader.
 * @param {vec3} xyz
 * @param {string} modelName
 * @param {string} materialName
 * @param {string} shaderName
 * @param {TentaGL.MaterialProps} matProps    Optional. If not provided, a default MaterialProps is created.
 * @return {TentaGL.Sprite}
 */
TentaGL.Sprite.create = function(xyz, modelName, materialName, shaderName, matProps) {
  var sprite = new TentaGL.Sprite(xyz);
  
  if(!matProps) {
    matProps = new TentaGL.MaterialProps();
  }
  
  sprite.draw = function(gl) {
    try {
      TentaGL.ShaderLib.use(gl, shaderName);
      TentaGL.MaterialLib.use(gl, materialName);
      matProps.useMe(gl);
      TentaGL.ModelLib.render(gl, modelName);
    }
    catch (e) {
      // console.log("sprite resource not ready: " + e.message);
    }
  };
  
  return sprite;
};


