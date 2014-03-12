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
 * A composite sprite is similar to both a SceneGroup and a Sprite. It is a 
 * Sprite that consists of several other child SceneNodes.
 * If a component within a CompositeSprite is picked, the picker will return 
 * the CompositeSprite instead of the underlying sprite that was actually 
 * picked.
 * @mixes {TentaGL.Sprite}
 * @constructor
 * @param {vec3} xyz
 * @param {array:SceneNode} components
 */
TentaGL.CompositeSprite = function(xyz, components) {
  TentaGL.Sprite.call(this, xyz);
  
  this._components = [];
  for(var i in components) {
    this.addComponent(components[i]);
  }
};


TentaGL.CompositeSprite.prototype = {
  
  constructor:TentaGL.CompositeSprite,
  
  /** 
   * Adds a SceneNode as a component of this composite. 
   * @param {TentaGL.SceneNode} sceneNode
   */
  addComponent:function(sceneNode) {
    if(sceneNode.getCompositeParent()) {
      throw Error("CompositeSprite component cycle detected.");
    }
    
    this._components.push(sceneNode);
    sceneNode.setCompositeParent(this);
    sceneNode.setParent(this);
  },
  
  /** 
   * Returns the list of component SceneNodes composing this sprite.
   * @return {array:SceneNode}
   */
  getComponents:function() {
    return this._components;
  },
  
  
  /** 
   * Renders each component in the composite sprite, starting from index 0 to
   * the last index.
   * @param {WebGLRenderingContext} gl
   */
  draw:function(gl) {
    for(var i in this._components) {
      this._components[i].render(gl);
    }
  }
  
};


TentaGL.Inheritance.inherit(TentaGL.CompositeSprite, TentaGL.Sprite);

