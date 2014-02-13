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
 * @constructor
 * @param {Number} xyz  Optional. If the sprite's world coordinates aren't 
 *      provided, they will be set to [0, 0, 0].
 */
TentaGL.Sprite = function(xyz) {
  if(xyz === undefined) {
    xyz = [0, 0, 0];
  }
  this._xyz = vec4.fromValues(xyz[0], xyz[1], xyz[2]);
  
  //this._scaleXYZ = [1, 1, 1];
  //this._scaleUni = 1;
  
  //this._angleY = 0;
  //this._angleX = 0;
  //this._angleZ = 0;
  
  this._isVisible = true;
  //this._opacity = 1;
};


TentaGL.Sprite.prototype = {
  
  constructor:TentaGL.Sprite,
  
  
  //////// Visibility
  
  /** 
   * Returns true iff this sprite's visibility flag is true. 
   * @return {Boolean}
   */
  isVisible:function() {
    return this._isVisible;
  },
  
  
  /** 
   * Returns the sprite's opacity level. This value is in the range [0,1], 
   * where 0 is completely transparent and 1 is completely opaque.
   */
  getOpacity:function() {
    if(this._opacity === undefined) {
      return 1;
    }
    return this._opacity;
  },
  
  /** 
   * Sets the sprite's opacity level. This value is clamped to the range 
   * [0, 1], where 0 is completely transparent and 1 is completely opaque.
   * @param {Number} opacity
   */
  setOpacity:function(opacity) {
    this._opacity = TentaGL.Math.clamp(opacity, 0, 1);
  },
  
  
  /** 
   * Assigns the value of the sprite's opacity to a float uniform value in
   * the ShaderProgram currently in use.
   * @param {WebGLRenderingContext} gl
   * @param {string} uniName  The name of the uniform variable the opacity is
   *      bound to.
   */
  useOpacity:function(gl, uniName) {
    ShaderLib.current(gl).setUniValue(gl, uniName, this.getOpacity());
  },
  
  
  //////// Position
  
  /** 
   * Returns the Sprite's XYZ coordinates.
   * @return {vec4}
   */
  getXYZ:function() {
    return this._xyz;
  },
  
  /** 
   * Sets the Sprite's XYZ coordinates.
   * param {vec3} xyz
   */
  setXYZ:function(xyz) {
    this._xyz[0] = xyz[0];
    this._xyz[1] = xyz[1];
    this._xyz[2] = xyz[2];
  },
  
  /**
   * Returns the Sprites X coordinate.
   * @return {Number}
   */
  getX:function() {
    return this._xyz[0];
  },
  
  /**
   * Returns the Sprites Y coordinate.
   * @return {Number}
   */
  getY:function() {
    return this._xyz[1];
  },
  
  /**
   * Returns the Sprites Z coordinate.
   * @return {Number}
   */
  getZ:function() {
    return this._xyz[2];
  },
  
  
  //////// Euclid angles
  
  /** 
   * Returns the angle of rotation of this sprite, in  radians, about its 
   * X axis.
   * @return {Number}
   */
  getAngleX:function() {
    return this._angleX;
  },
  
  /** 
   * Sets the angle of rotation of this sprite, in radians, about its X axis.
   * @param {Number} angle
   */
  setAngleX:function(angle) {
    this._angleX = angle;
  },
  
  /** 
   * Returns the angle of rotation of this sprite, in  radians, about its 
   * Y axis.
   * @return {Number}
   */
  getAngleY:function() {
    return this._angleY;
  },
  
  /** 
   * Sets the angle of rotation of this sprite, in radians, about its Y axis.
   * @param {Number} angle
   */
  setAngleY:function(angle) {
    this._angleY = angle;
  },
  
  /** 
   * Returns the angle of rotation of this sprite, in  radians, about its 
   * Z axis.
   * @return {Number}
   */
  getAngleZ:function() {
    return this._angleZ;
  },
  
  /** 
   * Sets the angle of rotation of this sprite, in radians, about its Z axis.
   * @param {Number} angle
   */
  setAngleZ:function(angle) {
    this._angleZ = angle;
  },
  
  
  
  //////// Quaterion TODO
  
  
  
  
  //////// Scale
  
  /** 
   * Returns the sprite's scales along its X, Y, and Z axes.
   * @return {vec3}
   */
  getScaleXYZ:function() {
    if(this._scaleXYZ === undefined) {
      return vec3.fromValues(1, 1, 1);
    }
    return this._ScaleXYZ;
  },
  
  /** 
   * Sets the sprite's scales along its X, Y, and Z axes.
   * @param {vec3} xyz
   */
  setScaleXYZ:function(xyz) {
    this._scaleXYZ = vec3.fromValues(xyz[0], xyz[1], xyz[2]);;
  },
  
  /** 
   * Returns the X component of the sprite's scale.
   * @return {Number}
   */
  getScaleX:function() {
    return this._scaleXYZ[0];
  },
  
  /**
   * Returns the Y component of the sprite's scale.
   * @return {Number}
   */
  getScaleY:function() {
    return this._scaleXYZ[1];
  },
  
  /** 
   * Returns the Z component of the sprite's scale.
   * @return {Number}
   */
  getScaleZ:function() {
    return this._scaleXYZ[2];
  },
  
  /** 
   * Returns the uniform scale value of the sprite. 
   * In the sprite's scale transform, this multiplies the axial scale values
   * of the sprite.
   * @return {Number}
   */
  getScaleUni:function() {
    if(this._scaleUni === undefined) {
      return 1;
    }
    return this._scaleUni;
  },
  
  /** 
   * Sets the uniform scale value of the sprite.
   * In the sprite's scale transform, this multiplies the axial scale values
   * of the sprite.
   * @param {Number} coeff
   */
  setScaleUni:function(coeff) {
    this._scaleUni = coeff;
  }
  
};


