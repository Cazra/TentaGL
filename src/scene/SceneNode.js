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
 * Interface for a node in a scene graph. All nodes in a scene graph have a set
 * of affine transforms which are implemented here. SceneNodes can also be made
 * visible or invisible.
 * @constructor
 * @param {vec3} xyz    The node's position in local 3D space.
 */
TentaGL.SceneNode = function(xyz) {
  if(xyz === undefined) {
    xyz = [0, 0, 0];
  }
  if(!xyz[2]) {
    xyz[2] = 0;
  }
  
  this._xyz = vec3.copy([], xyz);
  
  this._scaleXYZ = [1, 1, 1];
  this._scaleUni = 1;
  
  this._quat = quat.create();
  
  this._objLook = [0,0,1];
  this._objUp = [0,1,0];
  
  this._transform = mat4.create();
  this._tranDirty = true;
  this._isVisible = true;
  
  this._opacity = 1.0;
  
  this._parent = undefined;
};


TentaGL.SceneNode.prototype = {
  
  constructor:TentaGL.SceneNode,
  
  isaSceneNode: true,
  
  /** 
   * Frees any GL memory and resources used only by this SceneNode. 
   * This should be called before disposing of the node. The default 
   * implementation does nothing.
   * Override me.
   */
  clean:function(gl) {},
  
  
  //////// Scene Graph hierarchy
  
  /**
   * Returns the parent of this node in the scene graph. If this node has no
   * parent, it returns undefined.
   * @return {TentaGL.SceneNode}
   */
  getParent:function() {
    return this._parent;
  },
  
  /** 
   * Sets the parent of this node in the scene graph. Although it is possible
   * for a node to be a child for several nodes, a node can only have 1 parent.
   * This can produce unpredictable results when calling methods to get the 
   * node's world transforms which require a traversal up the node's 
   * ancestors.
   * @param {TentaGL.SceneNode}
   */
  setParent:function(node) {
    this._parent = node;
  },
  
  
  /** 
   * Returns whether this node has a parent node in the scene graph. 
   * @return {Boolean}
   */
  hasParent:function() {
    if(this._parent) {
      return true;
    }
    else {
      return false;
    }
  },
  
  /** 
   * Removes this node from its parent in the scene graph.
   */
  removeFromParent:function() {
    if(this._parent && this._parent.remove) {
      this._parent.remove(this);
      this._parent = null;
    }
  },
  
  
  //////// Visibility
  
  /** 
   * Returns true iff this node's visibility flag is true. 
   * @return {Boolean}
   */
  isVisible:function() {
    return this._isVisible;
  },
  
  
  /** 
   * Sets whether this node is visible. 
   */
  setVisible:function(visible) {
    this._isVisible = visible;
  },
  
  
  
  
  //////// Opacity
  
  /** 
   * Setter/getter for the sprite's opacity. This should always be some value 
   * in the range [0, 1].
   * @param {float} o   Optional. The new opacity level.
   * @return {float}
   */
  opacity: function(o) {
    if(o !== undefined) {
      this._opacity = Math.max(0, Math.min(o, 1));
    }
    return this._opacity;
  },
  
  
  /** 
   * Sets the uniform variable in the current shader for the sprite's opacity.
   * @param {WebGLRenderingContext} gl
   */
  useOpacity: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    if(program.setOpacity) {
      program.setOpacity(gl, this._opacity);
    }
  },
  
  
  
  //////// Position
  
  /** 
   * Returns the XYZ position of this node in world coordinates. 
   * @return {vec3}
   */
  getWorldXYZ:function() {
    var wTran = this.getWorldTransform();
    var x = wTran[12];
    var y = wTran[13];
    var z = wTran[14];
    return [x,y,z];
  },
  
  
  
  /** 
   * Setter/getter for the node's XYZ position.
   * @param {vec3} xyz    Optional.
   * @return {vec3}
   */
  xyz: function(xyz) {
    if(xyz !== undefined) {
      this._xyz = vec3.copy([], xyz);
      this._tranDirty = true;
    }
    return this._xyz;
  },
  
  
  /** 
   * Setter/getter for the node's XY position. The Z coordinate is not modified.
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  xy: function(xy) {
    if(xy !== undefined) {
      this._xyz[0] = xy[0];
      this._xyz[1] = xy[1];
      this._tranDirty = true;
    }
    return this._xyz.slice(0,2);
  },
  
  
  /** 
   * Shorthand getter/setter for the node's x position.
   */
  x: function(x) {
    if(x !== undefined) {
      this._xyz[0] = x;
      this._tranDirty = true;
    }
    else {
      return this._xyz[0];
    }
  },
  
  /** 
   * Shorthand getter/setter for the node's y position.
   */
  y: function(y) {
    if(y !== undefined) {
      this._xyz[1] = y;
      this._tranDirty = true;
    }
    else {
      return this._xyz[1];
    }
  },
  
  /** 
   * Shorthand getter/setter for the node's z position.
   */
  z: function(z) {
    if(z !== undefined) {
      this._xyz[2] = z;
      this._tranDirty = true;
    }
    else {
      return this._xyz[2];
    }
  },
  
  
  
  
  
  //////// Quaterion/Orientation
  
  
  /** 
   * Returns the quaternion for this sprite. 
   * @return {quat}
   */
  getQuat:function() {
    return this._quat;
  },
  
  /** 
   * Sets the quaternion for this sprite. 
   * @param {quat} q
   */
  setQuat:function(q) {
    this._quat = q;
    this._tranDirty = true;
  },
  
  /** 
   * Setter/getter for the sprite's quaternion for 3D rotation/orientation.
   * @param {quat} q    Optional.
   * @return {quat}
   */
  quat: function(q) {
    if(q !== undefined) {
      this._quat = q;
      this._tranDirty = true;
    }
    return this._quat;
  },
  
  
  /** 
   * Shortcut for setting the sprite's quaternion to a rotation around some 
   * axis.
   * @param axis      The axis of rotation.
   * @param radians   The number of degrees to rotate counter-clockwise around 
   *                  the axis.
   * @return {quat}   The resulting quaternion.
   */
  setAxisRotation: function(axis, radians) {
    var q = quat.setAxisAngle([], axis, radians);
    return this.quat(q);
  },
  
  
  /** 
   * Returns the quaternion representing this node's orientation 
   * in world coordinates. 
   * @return {quat}
   */
  getWorldQuat:function() {
    return this._getWorldQuat(quat.create());
  },
  
  _getWorldQuat:function(q) {
    quat.mul(q, this.getQuat(), q);
    if(this._parent) {
      return this._parent._getWorldQuat(q);
    }
    else {
      return q;
    }
  },
  
  
  
  /** 
   * Returns the parent node's quaternion in world coordinates, or the 
   * ID quaternion if this node has no parent.
   * @return {quat}
   */
  getParentWorldQuat:function() {
    if(this._parent) {
      return this._parent.getWorldQuat();
    }
    else {
      return quat.create();
    }
  },
  
  
  /** 
   * Rotates the quaternion for this node ccw around the specified axis by the  
   * specified number of radians. 
   * @param {vec3} axis
   * @param {Number} rads
   */
  rotate:function(axis, rads) {
    var q = quat.setAxisAngle(quat.create(), axis, rads);
    this.setQuat(quat.mul(this._quat, q, this._quat));
  },
  
  
  /** 
   * Rotates the quaternion for this node's orientation S with some 
   * other quaternion T. 
   * The result quaternion is Q = T*S.
   * @param {quat} q
   */
  mulQuat:function(q) {
    this.setQuat(quat.mul(this._quat, q, this._quat));
  },
  
  
  //////// Look vector & orientation
  
  /** 
   * Returns the node's unit look vector in local space. This is used as the X
   * axis in the node's look space.
   * @return {vec3}
   */
  getBaseLook:function() {
    return this._objLook;
  },
  
  
  /** 
   * Returns the node's unit look vector in world space. This is used as the X
   * axis in the node's look space.
   * @return {vec3}
   */
  getWorldBaseLook:function() {
    var q = this.getParentWorldQuat();
    return vec3.transformQuat(vec3.create(), this._objLook, q);
  },
  
  
  /** 
   * Sets and normalizes the base look vector for the node in local space. 
   * @param {vec3} look
   */
  setBaseLook:function(look) {
    vec3.normalize(this._objLook, look);
    this._correctUpVector();
  },
  
  
  /** 
   * Get the node's oiented look vector in local coordinates.
   * @return {vec3}
   */
  getLook:function() {
    return vec3.transformQuat(vec3.create(), this._objLook, this._quat);
  },
  
  
  
  /** 
   * Returns the oriented look vector of this node in world coordinates. 
   * @return {vec3}
   */
  getWorldLook:function() {
    var worldQuat = this.getWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseLook(), worldQuat);
  },

  
  //////// Right vector & orientation
  
  /**
   * Returns the node's base unit right vector. (The cross product
   * of the look and up unit vectors). This is used as the Z axis in
   * look space.
   */
  getBaseRight:function() {
    return vec3.cross(vec3.create(), this._objLook, this._objUp);
  },
  
  /** 
   * Returns the node's unit right vector in world space. This is used as the Z 
   * axis in look space.
   * @return {vec3}
   */
  getWorldBaseRight:function() {
    var q = this.getParentWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseRight(), q);
  },
  
  
  /** 
   * Returns the oriented right vector of this node in local space.
   * @return {vec3}
   */
  getRight:function() {
    return vec3.transformQuat(vec3.create(), this.getBaseRight(), this._quat);
  },
  
  
  /**
   * Returns the oriented right vector of this node in world coordinates.
   * @return {vec3}
   */
  getWorldRight:function() {
    var worldQuat = this.getWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseRight(), worldQuat);
  },
  
  
  //////// Up vector & orientation
  
  /** 
   * Get the node's oriented up vector in local coordinates.
   * @return {vec3}
   */
  getUp:function() {
    return vec3.transformQuat(vec3.create(), this._objUp, this._quat);
  },
  
  
  /**
   * Returns the oriented up vector of this node in world coordinates.
   * @return {vec3}
   */
  getWorldUp:function() {
    var worldQuat = this.getWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseUp(), worldQuat);
  },
  
  
  /** 
   * Returns the node's base unit up vector. This is used as the Y axis in the
   * node's look space. 
   * @return {vec3}
   */
  getBaseUp:function() {
    return this._objUp;
  },
  
  /** 
   * Sets and normalizes the base up vector for the node. 
   * @param {vec3} up
   */
  setBaseUp:function(up) {
    vec3.normalize(this._objUp, up);
    this._correctUpVector();
  },
  
  
  /** 
   * Setter/getter for the node's base unit up vector. This is used as the Y 
   * axis in the node's look space.
   * @param {vec3} up   Optional.
   * @return {vec3}
   */
  baseUp: function(up) {
    if(up !== undefined) {
      vec3.normalize(this._objUp, up);
      this._correctUpVector();
    }
    return this._objUp;
  },
  
  
  /** 
   * Returns the node's unit up vector in world space. This is used as the Y
   * axis in the node's look space.
   * @return {vec3}
   */
  getWorldBaseUp:function() {
    var q = this.getParentWorldQuat();
    return vec3.transformQuat(vec3.create(), this._objUp, q);
  },
  

  
  
  /** 
   * Corrects the base up vector so that it forms a right angle with the base 
   * look vector. 
   */
  _correctUpVector:function() {
    var look = this._objLook;
    var up = this._objUp;
    var right = vec3.cross(vec3.create(), look, up);
    this._objUp = vec3.cross(up, right, look);
  },
  
  
  //////// Look/Up/Right vectors
  
  /** 
   * Returns an array containing the node's base look, up, and right vectors, 
   * in that order.
   * @return {length 3 array} Each element is a vec3.
   */
  getBaseLookVectors:function() {
    return [this.getBaseLook(), this.getBaseUp(), this.getBaseRight()];
  },
  
  
  /** 
   * Returns an array containing the node's look, up, and right vectors in
   * local coordinates, in that order.
   * @return {length 3 array} Each element is a vec3.
   */
  getLookVectors:function() {
    var q = this.getQuat();
    var look = vec3.transformQuat(vec3.create(), this._objLook, this._quat);
    var up = vec3.transformQuat(vec3.create(), this._objUp, this._quat);
    var right = vec3.transformQuat(vec3.create(), this.getBaseRight, this._quat);
    
    return [look, up, right];
  },
  
  /** 
   * Returns an array containing the node's look, up, and right vectors in
   * world coordinates, in that order.
   * @return {length 3 array} Each element is a vec3.
   */
  getWorldLookVectors:function() {
    var q = this.getWorldQuat();
    var look = vec3.transformQuat(vec3.create(), this._objLook, this._quat);
    var up = vec3.transformQuat(vec3.create(), this._objUp, this._quat);
    var right = vec3.transformQuat(vec3.create(), this.getBaseRight, this._quat);
    
    return [look, up, right];
  },
  
  
  
  
  //////// Orientation
  
  /** 
   * Orients the node so that its look and up vectors are in the 
   * specified directions in local space. 
   * @param {vec3} look
   * @param {vec3} up
   */
  orient:function(look, up) {
    this.setQuat(TentaGL.Math.getOrientation(this.getBaseLook(), this.getBaseUp(), look, up));
  },
  
  /** 
   * Orients the node so that its look and up vectors are in the specified 
   * directions in world space.
   * @param {vec3} look
   * @param {vec3} up
   */
  orientWorld:function(look, up) {
    var qToLocal = this.getParentWorldQuat();
    quat.invert(qToLocal, qToLocal);
    look = vec3.transformQuat(vec3.create(), look, qToLocal);
    up = vec3.transformQuat(vec3.create(), up, qToLocal);
    
    this.setQuat(TentaGL.Math.getOrientation(this.getBaseLook(), this.getBaseUp(), look, up));
  },
  
  
  //////// Look-At/Billboarding
  
  /** 
   * Orients the node to look towards the specified point in local space.
   * The look vector will be oriented towards the point, but the up vector
   * will be tilted from the base up vector.
   */
  lookAt:function(p) {
    var xyz = this.xyz();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, this.getBaseUp());
    var up = vec3.cross(vec3.create(), right, look);
    
    this.orient(look, up);
  },
  
  /** 
   * Orients the node to look towards the specified point in world space.
   * The look vector will be oriented towards the point, but the up vector
   * will be tilted from the base up vector.
   */
  lookAtWorld:function(p) {
    var xyz = this.getWorldXYZ();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, this.getWorldBaseUp());
    var up = vec3.cross(vec3.create(), right, look);
    
    this.orientWorld(look, up);
  },
  
  
  
  
  /** 
   * Orients the node so that it looks towards a certain point in local space 
   * and its up vector is oriented in some specified general direction 
   * in local space.
   * @param {vec4} p    The point to look at.
   * @param {vec3} up   The general direction of "up".
   */
  billboardPoint:function(p, up) {
    var xyz = this.xyz();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, up);
    up = vec3.cross(vec3.create(), right, look);
    
    this.orient(look, up);
  },
  
  
  /** 
   * Orients the node so that it looks towards a certain point in world space 
   * and its up vector is oriented in some specified general direction 
   * in world space.
   * @param {vec4} p    The point to look at.
   * @param {vec3} up   The general direction of "up".
   */
  billboardWorldPoint:function(p, up) {
    var xyz = this.getWorldXYZ();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, up);
    up = vec3.cross(vec3.create(), right, look);
    
    this.orientWorld(look, up);
  },
  
  
  /** 
   * Orients the node so that it looks in the direction of some point in local space, 
   * but its up vector remains set as the base up vector.
   */
  billboardAxis:function(p) {
    var xyz = this.xyz();
    var baseLook = this.getBaseLook();
    var baseUp = this.getBaseUp();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var q = TentaGL.Math.getQuatFromTo(baseLook, look);
    var up = vec3.transformQuat(vec3.create(), baseUp, q);
    
    var rightP = vec3.cross(vec3.create(), look, baseUp);
    var upP = vec3.cross(vec3.create(), rightP, look);
    
    var q2 = TentaGL.Math.getQuatFromTo(up, upP);
    quat.mul(q, q2, q);
    
    var q2 = TentaGL.Math.getQuatFromTo(upP, baseUp);
    quat.mul(q, q2, q);
    
    look = vec3.transformQuat(look, baseLook, q);
    up = baseUp
    
    
    this.orient(look, up);
  },
  
  
  /** 
   * Orients the node so that it looks in the direction of some point in world space, 
   * but its up vector remains set as the base up vector.
   */
  billboardWorldAxis:function(p) {
    var xyz = this.getWorldXYZ();
    var baseLook = this.getWorldBaseLook();
    var baseUp = this.getWorldBaseUp();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var q = TentaGL.Math.getQuatFromTo(baseLook, look);
    var up = vec3.transformQuat(vec3.create(), baseUp, q);
    
    var rightP = vec3.cross(vec3.create(), look, baseUp);
    var upP = vec3.cross(vec3.create(), rightP, look);
    
    var q2 = TentaGL.Math.getQuatFromTo(up, upP);
    quat.mul(q, q2, q);
    
    var q2 = TentaGL.Math.getQuatFromTo(upP, baseUp);
    quat.mul(q, q2, q);
    
    look = vec3.transformQuat(look, baseLook, q);
    up = baseUp
    
    
    this.orientWorld(look, up);
  },
  
  
  /** 
   * Orients the node so that it is oriented in some plane in local space
   * defined by a look vector and an up vector.
   * @param {vec3} look
   * @param {vec3} up
   */
  billboardPlane:function(look, up) {
    this.orient(look, up);
  },
  
  
  /** 
   * Orients the node so that it is oriented in some plane in local space
   * defined by a look vector and an up vector.
   * @param {vec3} look
   * @param {vec3} up
   */
  billboardWorldPlane:function(look, up) {
    this.orientWorld(look, up);
  },
  
  
  //////// Scale
  
  
  /** 
   * Setter getter for the node's scale on the X, Y, and Z axes.
   * @param {vec3} xyz    Optional. If Z is not provided, it is set to 0.
   * @return {vec3}
   */
  scale: function(xyz) {
    if(xyz !== undefined) {
      if(!xyz[2]) {
        xyz[2] = 0;
      }
      this._scaleXYZ = vec3.copy([], xyz);
      this._tranDirty = true;
    }
    return this._ScaleXYZ;
  },
  
  
  /** 
   * Shorthand getter/setter for the scale's X component. 
   * @param {number} x    Optional.
   * @return {number}
   */
  scaleX: function(x) {
    if(x !== undefined) {
      this._scaleXYZ[0] = x;
      this._tranDirty = true;
    }
    return this._scaleXYZ[0];
  },
  
  
  /** 
   * Shorthand getter/setter for the scale's Y component. 
   * @param {number} y    Optional.
   * @return {number}
   */
  scaleY: function(y) {
    if(y !== undefined) {
      this._scaleXYZ[1] = y;
      this._tranDirty = true;
    }
    return this._scaleXYZ[1];
  },
  
  
  /** 
   * Shorthand getter/setter for the scale's Z component. 
   * @param {number} z    Optional.
   * @return {number}
   */
  scaleZ: function(z) {
    if(z !== undefined) {
      this._scaleXYZ[2] = z;
      this._tranDirty = true;
    }
    return this._scaleXYZ[2];
  },
  
  
  /** 
   * Shorthand getter/setter for the scale's uniform component. 
   * @param {number} u    Optional.
   * @return {number}
   */
  scaleU: function(u) {
    if(u !== undefined) {
      this._scaleUni = u;
      this._tranDirty = true;
    }
    return this._scaleUni;
  },
  
  
  /** 
   * Returns the scale's uniform component in world space.
   * @return {number}
   */
  getWorldScaleU:function() {
    var scale = this.scaleU();
    if(this._parent) {
      scale *= this._parent.getWorldScaleU();
    }
    return scale;
  },
  
  //////// Model transform
  
  
  /** 
   * Produces and returns the sprite's local model transform.
   * @return {mat4}
   */
  getModelTransform:function() {
    if(this._tranDirty) {
      this._transform = this.getTRSTransform();
      this._tranDirty = false;
    }
    return this._transform;
  },
  
  
  getTRSTransform:function() {
    var tx = this.x();
    var ty = this.y();
    var tz = this.z();
    
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
    
    m[12] = tx;
    m[13] = ty;
    m[14] = tz;
    m[15] = 1;
    
    return m;
  },
  
  
  /** 
   * Obtains the world transform matrix for this node in the scene graph. 
   * This is simply the product of this node's model transform with its
   * ancestors' that results in the final model transformation of the node at 
   * render time.
   * @return {mat4}
   */
  getWorldTransform:function() {
    return this._getWorldTransform(mat4.create());
  },
  
  /** Private helper for getWorldTransform. */
  _getWorldTransform:function(resultMat) {
    mat4.mul(resultMat, this.getModelTransform(), resultMat);
    if(this._parent) {
      this._parent._getWorldTransform(resultMat);
    }
    return resultMat;
  },
  
  
  
  //////// Rendering
  
  
  /** 
   * Renders this node, temporarily concatenating its model transform to the 
   * current Model-view transform of the scene. 
   * @param {WebGLRenderingContext} gl
   */
  render:function(gl) {
    if(!this.isVisible() || !TentaGL.SceneNode.filter(this)) {
      return;
    }
    TentaGL.ViewTrans.push(gl);
    
    TentaGL.ViewTrans.mul(gl, this.getModelTransform());
    this.useOpacity(gl);
    this.draw(gl);
    
    TentaGL.ViewTrans.pop(gl);
  },
  
  
  /** 
   * Renders the node without filtering. Calling this allows nodes rendered 
   * within other nodes to be registered as the root node in the picker.
   * e.g., If node A calls renderComposite for nodes B and C in its render
   * method and the picker is later queried at the position where B or C was
   * rendered, the picker will return A. 
   * @param {WebGLRenderingContext} 
   */
  renderComposite: function(gl) {
    if(!this.isVisible()) {
      return;
    }
    TentaGL.ViewTrans.push(gl);
    
    TentaGL.ViewTrans.mul(gl, this.getModelTransform());
    this.useOpacity(gl);
    this.draw(gl);
    
    TentaGL.ViewTrans.pop(gl);
  },
  
  
  /** 
   * "Draws" the contents of this node.
   * Override this. 
   */
  draw:function(gl) {}
};


/** 
 * Always returns true for all nodes. 
 * @param {TentaGL.SceneNode} node
 * @return {boolean}
 */
TentaGL.SceneNode.defaultRenderFilter = function(node) {
  return true;
};

/** 
 * Returns the function being used as the rendering filter for the scene graph.
 * If the render filter has not been set, it will be set to the default filter,
 * which always returns true.
 * @return {function(node : TentaGL.SceneNode) : boolean}
 */
TentaGL.SceneNode.getRenderFilter = function() {
  if(!TentaGL.SceneNode._renderFilter) {
    TentaGL.SceneNode.resetRenderFilter();
  }
  return TentaGL.SceneNode._renderFilter;
};

/**
 * Sets the function used as the rendering filter for the scene graph.
 * This rendering filter is used to tell the scene graph whether a node 
 * (and everything underneath it in the tree) should be rendered. 
 * The node will be rendered if the current rendering filter returns true for it.
 * @param {function(node : TentaGL.SceneNode) : boolean} filter
 */
TentaGL.SceneNode.setRenderFilter = function(filter) {
  TentaGL.SceneNode._renderFilter = filter;
};


/** 
 * Sets the scene graph's rendering filter to the default one, 
 * which always returns true. 
 */
TentaGL.SceneNode.resetRenderFilter = function() {
  TentaGL.SceneNode.setRenderFilter(TentaGL.SceneNode.defaultRenderFilter);
};


/** 
 * Calls the current rendering filter on a SceneNode and returns the filter's result. 
 * @param {TentaGL.SceneNode} node
 * @return {boolean}
 */
TentaGL.SceneNode.filter = function(node) {
  return TentaGL.SceneNode.getRenderFilter()(node);
};


Util.Inheritance.inherit(TentaGL.SceneNode, TentaGL.Renderable);


