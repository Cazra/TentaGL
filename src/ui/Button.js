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
 * A component that performs some action when clicked.
 * @constructor
 * @abstract
 * @param {vec3} xyz
 * @param {function(): undefined} action    Optional. A callback that is 
 *      executed when the button is clicked. 
 */
TentaGL.UI.Button = function(xyz, action) {
  TentaGL.UI.Component.call(this, xyz);
  
  if(!action) {
    action = function() {};
  }
  this.onClick = function(mouse) {
    action();
  };
};

TentaGL.UI.Button.prototype = {
  
  constructor: TentaGL.UI.Button,
  
  isaButtonSprite: true
};

Util.Inheritance.inherit(TentaGL.UI.Button, TentaGL.UI.Component);



/** 
 * Creates a simple, generic button sprite which renders using a specified model, 
 * material, material lighting properties, and shader. No behavior is defined
 * for any its handlers.
 * @param {vec3} xyz
 * @param {string} modelName
 * @param {string} materialName
 * @param {string} shaderName
 * @param {TentaGL.MaterialProps} matProps    Optional. If not provided, a default MaterialProps is created.
 * @return {TentaGL.Sprite}
 */
TentaGL.UI.Button.create = function(xyz, modelName, materialName, shaderName, matProps) {
  var sprite = new TentaGL.UI.Button(xyz);
  
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
    
    TentaGL.UI.Button.prototype.draw.call(this, gl);
  };
  
  return sprite;
};

