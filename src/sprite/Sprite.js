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
    if(this._angleX === undefined) {
      return 0;
    }
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
    if(this._angleY === undefined) {
      return 0;
    }
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
    if(this._angleZ === undefined) {
      return 0;
    }
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
    if(this._scaleXYZ === undefined) {
      return 1;
    }
    return this._scaleXYZ[0];
  },
  
  /**
   * Returns the Y component of the sprite's scale.
   * @return {Number}
   */
  getScaleY:function() {
    if(this._scaleXYZ === undefined) {
      return 1;
    }
    return this._scaleXYZ[1];
  },
  
  /** 
   * Returns the Z component of the sprite's scale.
   * @return {Number}
   */
  getScaleZ:function() {
    if(this._scaleXYZ === undefined) {
      return 1;
    }
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
  },
  
  
  //////// Model transform
  
  
  /** 
   * Produces and returns the sprite's model transform.
   * @return {mat4}
   */
  getModelTransform:function() {
  //  var m = mat4.create();
  //  var i = mat4.create();
  //  m = mat4.mul(m, m, mat4.translate(mat4.create(), i, this.getXYZ()));
    
    m = this.getTRotYXZSTransform();
    
  //  m = mat4.mul(m, m, this.getRotYXZSTransform());
    
  //  m = mat4.mul(m, m, mat4.scale(mat4.create(), i, 
  //                                [ this.getScaleX()*this.getScaleUni(), 
  //                                  this.getScaleY()*this.getScaleUni(),
  //                                  this.getScaleZ()*this.getScaleUni()]));
    return m;
  },
  
  
  getTRotYXZSTransform:function() {
    var tx = this.getX();
    var ty = this.getY();
    var tz = this.getZ();
    
    var sx = Math.sin(this.getAngleX());
    var cx = Math.cos(this.getAngleX());
    
    var sy = Math.sin(this.getAngleY());
    var cy = Math.cos(this.getAngleY());
    
    var sz = Math.sin(this.getAngleZ());
    var cz = Math.cos(this.getAngleZ());
    
    var scaleX = this.getScaleX()*this.getScaleUni();
    var scaleY = this.getScaleY()*this.getScaleUni();
    var scaleZ = this.getScaleZ()*this.getScaleUni();
    
    var m = TentaGL.mat4Recyclable; //mat4.create();
    m[0] = scaleX*(cy*cz + sy*sx*sz);
    m[1] = scaleX*(cx*sz);
    m[2] = scaleX*(cy*sx*sz - sy*cz);
    m[3] = 0;
    
    m[4] = scaleY*(sy*sx*cz - cy*sz);
    m[5] = scaleY*(cx*cz);
    m[6] = scaleY*(sy*sz + cy*sx*cz);
    m[7] = 0;
    
    m[8] = scaleZ*(sy*cx);
    m[9] = scaleZ*(-sx);
    m[10] = scaleZ*(cy*cx);
    m[11] = 0;
    
    m[12] = tx;
    m[13] = ty;
    m[14] = tz;
    m[15] = 1;
    
    return m;
  },
  
  
  getRotYXZSTransform:function() {
    var sx = Math.sin(this.getAngleX());
    var cx = Math.cos(this.getAngleX());
    
    var sy = Math.sin(this.getAngleY());
    var cy = Math.cos(this.getAngleY());
    
    var sz = Math.sin(this.getAngleZ());
    var cz = Math.cos(this.getAngleZ());
    
    var scaleX = this.getScaleX()*this.getScaleUni();
    var scaleY = this.getScaleY()*this.getScaleUni();
    var scaleZ = this.getScaleZ()*this.getScaleUni();
    
    var m = mat4.create();
    m[0] = scaleX*(cy*cz + sy*sx*sz);
    m[1] = scaleX*(cx*sz);
    m[2] = scaleX*(cy*sx*sz - sy*cz);
    
    m[4] = scaleY*(sy*sx*cz - cy*sz);
    m[5] = scaleY*(cx*cz);
    m[6] = scaleY*(sy*sz + cy*sx*cz);
    
    m[8] = scaleZ*(sy*cx);
    m[9] = scaleZ*(-sx);
    m[10] = scaleZ*(cy*cx);
    
    return m;
  },
  
  
  getRotYXZTransform:function() {
    var sx = Math.sin(this.getAngleX());
    var cx = Math.cos(this.getAngleX());
    
    var sy = Math.sin(this.getAngleY());
    var cy = Math.cos(this.getAngleY());
    
    var sz = Math.sin(this.getAngleZ());
    var cz = Math.cos(this.getAngleZ());
    
    var m = mat4.create();
    m[0] = cy*cz + sy*sx*sz;
    m[1] = cx*sz;
    m[2] = cy*sx*sz - sy*cz;
    
    m[4] = sy*sx*cz - cy*sz;
    m[5] = cx*cz;
    m[6] = sy*sz + cy*sx*cz;
    
    m[8] = sy*cx;
    m[9] = -sx;
    m[10] = cy*cx;
    
    return m;
  },
  
  getRotXTransform:function() {
    var sx = Math.sin(this.getAngleX());
    var cx = Math.cos(this.getAngleX());
    
    var m = mat4.create();
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    
    m[4] = 0;
    m[5] = cx;
    m[6] = sx;
    
    m[8] = 0;
    m[9] = -sx;
    m[10] = cx;
    
    return m;
  },
  
  getRotYTransform:function() {
    var sy = Math.sin(this.getAngleY());
    var cy = Math.cos(this.getAngleY());
    
    var m = mat4.create();
    
    m[0] = cy;
    m[1] = 0;
    m[2] = -sy;
    
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    
    m[8] = sy;
    m[9] = 0;
    m[10] = cy;
    
    return m;
  },
  
  getRotZTransform:function() {
    var sz = Math.sin(this.getAngleZ());
    var cz = Math.cos(this.getAngleZ());
    
    var m = mat4.create();
    
    m[0] = cz;
    m[1] = sz;
    m[2] = 0;
    
    m[4] = -sz;
    m[5] = cz;
    m[6] = 0;
    
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    
    return m;
  },
  
  getRotXZTransform:function() {
    var sx = Math.sin(this.getAngleX());
    var cx = Math.cos(this.getAngleX());
    
    var sz = Math.sin(this.getAngleZ());
    var cz = Math.cos(this.getAngleZ());
    
    var m = mat4.create();
    
    m[0] = cz;
    m[1] = cx*sz;
    m[2] = sx*sz;
    
    m[4] = -sz;
    m[5] = cx*cz;
    m[6] = sx*cz;
    
    m[8] = 0;
    m[9] = -sx;
    m[10] = cx;
    
    return m;
  },
  
  //////// Rendering
  
  /** 
   * Sets up the concatenated model transform for the sprite and renders it. 
   * During rendering, gl gains a new normalMat field containing the current 
   * model transform. This allows Sprites to also be used as transform nodes
   * in a scene graph.
   */
  render:function(gl) {
    if(!this.isVisible()) {
      return;
    }
 
  /*
    // save the original matrix.
   var origMat = gl.modelViewMat || mat4.create();
    
    // Set the concatenated model transform matrix and draw the sprite.
    gl.modelViewMat = mat4.mul(TentaGL.mat4Recyclable, origMat, this.getModelTransform());
    var normalTrans = mat3.normalFromMat4(TentaGL.mat3Recyclable, gl.modelViewMat);
    var mvpTrans = mat4.mul(TentaGL.mat4Recyclable, gl.projMat, gl.modelViewMat);
    
    TentaGL.ShaderLib.current(gl).setMVPTransUniValue(gl, mvpTrans);
    TentaGL.ShaderLib.current(gl).setNormalTransUniValue(gl, normalTrans);
    
    this.draw(gl);
    
    // restore the original matrix.
    gl.modelViewMat = origMat;
    
    */
    
    TentaGL.pushTransform();
    
    TentaGL.mulTransform(this.getModelTransform());
    TentaGL.updateMVPUniforms(gl);
    
    this.draw(gl);
    
    TentaGL.popTransform();
  },
  
  /** 
   * Sets the materials for and draws the Models making up this sprite. 
   * Override this. 
   */
  draw:function(gl) {}
};


