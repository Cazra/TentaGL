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
 * A SceneNode containing a list of child SceneNodes. 
 * The group has an ordering from back to front with which it renders its
 * children nodes. The back nodes at the start of the group's list
 * are rendered first, followed by nodes towards the front at the end of the
 * group's list. This is more important for 2D rendering when depth-test
 * is turned off.
 */
TentaGL.SceneGroup = function(xyz) {
  TentaGL.SceneNode.call(this, xyz);
  this._children = [];
};


TentaGL.SceneGroup.prototype = {
  
  constructor:TentaGL.SceneGroup,
  
  
  /** 
   * Frees the GL memory and resources associated with any SceneNodes 
   * in this group. Then the group is cleared.
   */
  clean:function(gl) {
    for(var i in this._children) {
      this._children[i].clean(gl);
    }
    this.clear();
  },
  
  
  /** 
   * Returns the index of some node in the group. If the node doesn't exist in 
   * this group, it returns -1.
   * @param {TentaGL.SceneNode} node
   * @return {int}
   */
  indexOf:function(node) {
    return this._children.indexOf(node);
  },
  
  
  /** 
   * Returns the node at the specified index in the group.
   * @param {int} index
   * @return {TentaGL.SceneNode}
   */
  get:function(index) {
    return this._children[index];
  },
  
  /** 
   * Returns a copy of the group's children SceneNodes. 
   * @return {Array}
   */
  getChildren:function() {
    return this._children.concat([]);
  },
  
  
  /** 
   * Adds a node to the front of the group. 
   * @param {TentaGL.SceneNode} node
   */
  add:function(node) {
    this._children.push(node);
    node.setParent(this);
  },
  
  
  /** 
   * Returns the size of the group. 
   * @return {int}
   */
  size:function() {
    return this._children.length;
  },
  
  
  /** 
   * Removes a node from this group. Returns true if the remove was successful
   * or false if not.
   * @param {TentaGL.SceneNode} node
   * @return {Boolean}
   */
  remove:function(node) {
    var index = this._children.indexOf(node);
    if(index == -1) {
      return false;
    }
    else {
      this._children.splice(index, 1);
      return true;
    }
  },
  
  
  /** 
   * Removes all the group's children nodes. 
   */
  clear:function() {
    this._children = [];
  },
  
  /** 
   * Moves a node back 1 place in the group, swapping positions with the one
   * previously behind it.
   * @param {TentaGL.SceneNode} node
   */
  moveBack:function(node) {
    var index = this._children.indexOf(node);
    if(index > 0) {
      var temp = this._children[index-1];
      this._children[index-1] = this._children[index];
      this._children[index] = temp;
    }
  },
  
  /** 
   * Moves a node forward 1 place in the group, swapping positions with the one
   * previously in front of it.
   * @param {TentaGL.SceneNode} node
   */
  moveForward:function(node) {
    
    if(index != -1 && index < this._children.length) {
      var temp = this._children[index+1];
      this._children[index+1] = this._children[index];
      this._children[index] = temp;
    }
  },
  
  /** 
   * Moves a node to the front of the group. 
   * @param {TentaGL.SceneNode} node
   */
  moveToFront:function(node) {
    if(this.remove(node)) {
      this._children.push(node);
    }
  },
  
  
  /** 
   * Moves a node to the back of the group.
   * @param {TentaGL.SceneNode} node
   */
  moveToBack:function(node) {
    if(this.remove(node)) {
      this._children.unshift(node);
    }
  },
  
  
  /** 
   * Render's this group's children in ascending Z order in view space. 
   * @param {WebGLRenderingContext} gl
   */
  renderSorted:function(gl) {
    if(!this.isVisible()) {
      return;
    }
    
    // TODO: Better sorted rendering. This doesn't sort descendants of descendants.
    
    // Sort the children nodes.
    var viewTrans = TentaGL.Camera.get(gl).getViewTransform();
    this._children.sort(function(a, b) {
      var aPos = a.getWorldXYZ();
      vec3.transformMat4(aPos, aPos, viewTrans);
      
      var bPos = b.getWorldXYZ();
      vec3.transformMat4(bPos, bPos, viewTrans);
      
      return aPos[2] - bPos[2];
    });
    
    // Render the group node.
    this.render(gl);
  },
  
  
  /** Renders the nodes in this group. */
  draw:function(gl) {
    for(var i=0; i<this.size(); i++) {
      var child = this._children[i];
      child.render(gl);
    }
  }
};

TentaGL.Inheritance.inherit(TentaGL.SceneGroup, TentaGL.SceneNode);

